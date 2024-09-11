import { EventEmitter } from '@angular/core';
import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LoginApi } from '../login.api';
import { MSG_LOGIN } from '../longin.const';
import { IToast } from 'src/app/shared/toast/interface';
import { getToast } from 'src/app/shared/toast/constants';
import { ERRORS, FormValidations } from 'src/service/FormValidations';
import { UserValidation } from 'src/service/userValidation';
import { Router } from '@angular/router';
import { ElementNavBar } from 'src/service/elementNavBar';
import { ROUTES_COMPONENTS } from 'src/app/app-const.route';
import { ILogin, IValidacaoEmail } from 'src/app/shared/usuario/interfaces';

declare function assignUserInfo(user): any;

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  @Output() onChange = new EventEmitter<boolean>();

  toast: IToast = getToast();
  error = ERRORS;
  showToast = false;
  showPassword = false;
  formSignIp: FormGroup;
  userSignIn: ILogin;
  loading: boolean = false;

  constructor(
    readonly loginApi: LoginApi,
    readonly formBuilder: FormBuilder,
    readonly userValid: UserValidation,
    readonly navigateRoute: Router,
    readonly elementNavBar: ElementNavBar,
    readonly formValidations: FormValidations,
  ) { }

  ngOnInit() {
    // this.elementNavBar.validateMenuNavbar();
    this.createformSignIp();
  }

  showSignUp() {
    this.onChange.emit(false);
  }

  onValidateFormField(field: string, error: string, form: FormGroup) {
    return this.formValidations.validateFormField(field, error, form);
  }

  createformSignIp() {
    this.formSignIp = this.formBuilder.group({
      email:
        [
          null,
          [
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
            Validators.required
          ]
        ],
      password: [null, Validators.required],
    });
  }

  async onLogin() {
    if (this.formSignIp.valid) {
      this.formSignIp.disable();
      this.loading = true;

      const accessToken = await this.loginApi.postAuthenticatedUser(this.formSignIp.value)
        .catch((error) => {
          const  errorMessage = error.split(', ');
          this.toast = getToast(false, MSG_LOGIN.LOGIN_ERRO, errorMessage[0]);
          this.displayToast();
          this.loading = false;
          this.formSignIp.enable();
          this.isEmailValidation(errorMessage[1]);
          return null;
        });

      if (accessToken) {
        this.loading = false;
        this.formSignIp.enable();
        this.formSignIp.reset();
        this.userValid.storeToken(accessToken.response);

        this.assignUserToHotjarUser();

        this.navigateRoute.navigateByUrl(ROUTES_COMPONENTS.HOME);
      }
    } else {
      this.formSignIp = this.formValidations.validateFormControls(this.formSignIp);
    }
  }

  displayToast() {
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 2500);
  }

  private assignUserToHotjarUser() {
    let user = this.userValid.authenticatedUser();
    assignUserInfo(user);
  }

  isEmailValidation(errorMessage: string) {
    if (errorMessage.indexOf('403') != -1) {
      let tokenEmail = { Email: Math.random().toString(36).slice(-10) } as IValidacaoEmail;
      this.userValid.storageTokenEmail(tokenEmail);
      this.displayToast();
      setTimeout(() => {
        this.navigateRoute.navigateByUrl(ROUTES_COMPONENTS.LOGIN_VALIDATE_EMAIL + tokenEmail.Email);
      }, 2500);
    }
  }

}
