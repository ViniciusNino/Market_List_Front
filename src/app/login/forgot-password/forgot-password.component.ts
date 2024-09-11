import { getToast } from './../../../app/shared/toast/constants';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { LoginApi } from '../login.api';
import { FormValidations } from 'src/service/FormValidations';
import { IToast } from 'src/app/shared/toast/interface';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  loading = false;
  formPassword: FormGroup;
  toast: IToast = getToast();
  showToast = false;

  constructor(
    readonly modalController: ModalController,
    private formBuilder: FormBuilder,
    readonly formValidations: FormValidations,
    readonly loginApi: LoginApi,
  ) { }

  ngOnInit() {
    this.createFormPassword();
  }

  closeForgot() {
    this.modalController.dismiss({});
  }

  createFormPassword() {
    this.formPassword = this.formBuilder.group({
      email: [null, [Validators.email, Validators.required]]
    });
  }

  onValidateFormField(field: string, error: string, form: FormGroup) {
    return this.formValidations.validateFormField(field, error, form);
  }

  goComponentUser(route: string) {
    this.formPassword.reset();
  }

  async onForgotPassword() {
    console.log(this.formPassword)
    if (this.formPassword.valid) {
      this.loading = true;
      this.formPassword.disable();
      let errorMessage: Array<any> = [];
      const response = await this.loginApi.postForgotPassword(this.formPassword.value)
        .catch(error => {
          errorMessage = error.split(', ');
          this.displayToast(false, 'Request sent!', errorMessage[0]);
          this.loading = false;
          this.formPassword.enable();
          return null;
        });
      if (!errorMessage?.length) {
        this.displayToast(true, 'Get services!', 'Sent successfully, check your email');
        this.loading = false;
        this.formPassword.enable();
        setTimeout(() => {
          this.closeForgot();
        }, 3200);
      }
    } else {
      this.formPassword = this.formValidations.validateFormControls(this.formPassword);
    }
  }

  displayToast(sucess: boolean, title: string, notes: string) {
    this.toast = getToast(sucess, title, notes);
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}
