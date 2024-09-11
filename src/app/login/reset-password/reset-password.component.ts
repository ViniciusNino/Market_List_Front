import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LoginApi } from '../login.api';
import { IToast } from 'src/app/shared/toast/interface';
import { getToast } from 'src/app/shared/toast/constants';
import { Router } from '@angular/router';
import { FormValidations } from 'src/service/FormValidations';
import { ROUTES_COMPONENTS } from 'src/app/app-const.route';
import { ElementNavBar } from 'src/service/elementNavBar';
import { MustMatch } from 'src/service/settings.validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  loading = false;
  formResetPassword: FormGroup;
  toast: IToast = getToast();
  showToast = false;
  token: string;
  showCurrentPassword = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    readonly formValidations: FormValidations,
    readonly elementNavBar: ElementNavBar,
    private formBuilder: FormBuilder,
    readonly route: Router,
    readonly loginApi: LoginApi,
  ) { }

  get currentPassword() {return this.formResetPassword.get('currentPassword');}

  get newPassword() {return this.formResetPassword.get('newPassword');}

  get confirmPassword() {return this.formResetPassword.get('confirmPassword');}

  ngOnInit() {
    this.elementNavBar.validateMenuNavbar();
    this.createFormResetPassword();
    this.validToken();
  }

  onGoSignIn() {
    this.formResetPassword.reset();
    this.route.navigateByUrl(ROUTES_COMPONENTS.LOGIN);
  }

  createFormResetPassword() {
    this.formResetPassword = this.formBuilder.group({
      newPassword: [null,[Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#=.<>:()|/_;+-])[A-Za-z-0-9\d$@$!%*?&#=.<>:()|/_;+-].{7,}')]      ],
      confirmPassword: [null,
        Validators.required
      ]
    },
    {
      validator: MustMatch('newPassword', 'confirmPassword'),
    });
  }

  async validToken() {
    const url: Array<any> = window.location.pathname.split('/');
    this.token = url[url.length - 1];
    this.loading = true;
    this.formResetPassword.disable();
    let errorMessage: Array<any> = [];
    await this.loginApi.getValidateToken(this.token)
      .catch((error) => {
        this.loading = false;
        errorMessage = error.split(', ');
        this.displayToast(false, 'Token validation', errorMessage[0] + ' Request again!');
        setTimeout(() => {
          this.onGoSignIn();
        }, 3000);
        this.formResetPassword.enable();
        return null;
      });
    if (!errorMessage?.length) {
      this.loading = false;
      this.formResetPassword.enable();
    }
  }

  async onReset() {
    if (this.formResetPassword.valid) {
      this.loading = true;
      this.formResetPassword.disable();
      let errorMessage: Array<any> = [];
      await this.loginApi.putResetPassword(this.token, this.formResetPassword.value)
        .catch((error) => {
          this.loading = false;
          errorMessage = error.split(', ');
          this.displayToast(false, 'Reset Password', errorMessage[0]);
          this.formResetPassword.enable();
          return null;
        });
      if (!errorMessage?.length) {
        this.loading = false;
        this.formResetPassword.enable();
        this.displayToast(true, 'Reset Password', 'Password updated successfully!');
        setTimeout(() => {
          this.onGoSignIn();
        }, 3500);
      }
    } else {
      this.formResetPassword = this.formValidations.validateFormControls(this.formResetPassword);
    }
  }

  displayToast(sucess: boolean, title: string, notes: string) {
    this.toast = getToast(sucess, title, notes);
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 2500);
  }

}
