import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { LoginApi } from '../login.api';
import { MSG_LOGIN } from '../longin.const';
import { ROUTES_COMPONENTS } from 'src/app/app-const.route';
import { ERRORS, FormValidations } from 'src/service/FormValidations';
import { IToast } from 'src/app/shared/toast/interface';
import { getToast } from 'src/app/shared/toast/constants';
import { UserValidation } from 'src/service/userValidation';

@Component({
  selector: 'app-validate-email',
  templateUrl: './validate-email.component.html',
  styleUrls: ['./validate-email.component.scss'],
})
export class ValidateEmailComponent implements OnInit {
  loading: boolean = false;
  toast: IToast = getToast();
  showToast = false;
  isTokenExpired = false;
  formValidEmail: FormGroup;
  error = ERRORS;
  token: string;

  constructor(
    private formBuilder: FormBuilder,
    readonly route: ActivatedRoute,
    readonly formValidations: FormValidations,
    readonly loginApi: LoginApi,
    readonly navigateRoute: Router,
    readonly userValid: UserValidation,
  ) { }

  ngOnInit(): void {
    this.createFormEmail();
    this.validTokenAPI();
  }

  createFormEmail() {
    this.formValidEmail = this.formBuilder.group({
      email: [null, [Validators.email, Validators.required]]
    });
  }

  async validTokenAPI() {

    this.token = this.route.snapshot.paramMap.get('token');

    if (!this.token) {
      this.isTokenExpired = true;
      return;
    }

    const tokenEmail = this.userValid.getTokenEmail();

    if (tokenEmail.Email == this.token) {
      this.isTokenExpired = true;
    }

    else {
      this.loading = true;
      let errorMessage: Array<any> = [];

      const result = await this.loginApi.getValidateEmailToken(this.token)
        .catch((error) => {
          debugger
          this.loading = false;

          errorMessage = error.split(', ');

          this.toast = getToast(false, MSG_LOGIN.CONFIRMATION_EMAIL3, errorMessage.toString());
          this.displayToast()

          if (errorMessage[1].toString().includes("410")) {
            this.isTokenExpired = true;
          } else {
            this.onLogin();
          }

          return null;
        });

      if (!errorMessage?.length) {
        this.loading = false;
        this.toast = getToast(true, MSG_LOGIN.CONFIRMATION_EMAIL3, MSG_LOGIN.EMAIL_VALIDATED);
        this.displayToast()
      }
    }
  }

  async onSendEmail() {

    if (this.formValidEmail.valid) {

      this.loading = true;
      this.formValidEmail.disable();
      let errorMessage: Array<any> = [];

      await this.loginApi.postResendEmail(this.formValidEmail.value)
        .catch((error) => {
          this.loading = false;
          errorMessage = error.split(', ');
          this.toast = getToast(false, MSG_LOGIN.CONFIRMATION_EMAIL3, errorMessage[0]);
          this.displayToast()
          this.formValidEmail.enable();
          return null;
        });

      if (!errorMessage?.length) {
        this.loading = false;
        this.formValidEmail.enable();
        this.toast = getToast(true, MSG_LOGIN.CONFIRM_EMAIL1, MSG_LOGIN.CONFIRM_EMAIL2);
        this.displayToast()
        this.formValidEmail.reset();
      }
    } else {
      this.formValidEmail = this.formValidations.validateFormControls(this.formValidEmail);
    }
  }

  displayToast() {
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 2500);
  }

  onValidateFormField(field: string, error: string, form: FormGroup) {
    return this.formValidations.validateFormField(field, error, form);
  }

  onLogin() {
    this.navigateRoute.navigateByUrl(ROUTES_COMPONENTS.LOGIN);
  }
}
