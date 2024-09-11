import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ForgotPasswordComponent } from './../forgot-password/forgot-password.component';
import { LoginApi } from '../login.api';
import { MSG_LOGIN } from '../longin.const';
import { ERRORS, FormValidations } from 'src/service/FormValidations';
import { IToast } from 'src/app/shared/toast/interface';
import { getToast } from 'src/app/shared/toast/constants';
import { UserValidation } from 'src/service/userValidation';
import { ICadastroUsuario, ILogin } from 'src/app/shared/usuario/interfaces';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  @Output() onChange = new EventEmitter<boolean>();

  toast: IToast = getToast();
  loading: boolean = false;
  formSignUp: FormGroup;
  error = ERRORS;
  showPassword = false;
  showToast = false;

  constructor(
    readonly loginApi: LoginApi,
    readonly formBuilder: FormBuilder,
    readonly userValid: UserValidation,
    readonly modalController: ModalController,
    readonly formValidations: FormValidations,
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.formSignUp = this.formBuilder.group({
      email: [ null, [ Validators.email, Validators.required]],
      password: [null, [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#=.<>:()|/_;+-])[A-Za-z-0-9\d$@$!%*?&#=.<>:()|/_;+-].{7,}')]],
      remember: [null],
    });
  }

  onValidateFormField(field: string, error: string, form: FormGroup) {
    return this.formValidations.validateFormField(field, error, form);
  }

  async onCreateAccount() {
    if (this.formSignUp.valid) {
      this.formSignUp.disable();
      this.loading = true;
      let errorMessage: Array<any> = [];
      const user = this.formSignUp.value;
      await this.loginApi.postCreateAccount(user).catch((error) => {
        errorMessage = error.split(', ')[0];
        this.toast = getToast(false, MSG_LOGIN.ACCOUNT_CREATED_ERROR, errorMessage.toString());
        this.displayToast();
        this.loading = false;
        this.formSignUp.enable();
        return null;
      });
      if (!errorMessage.length) {
        this.toast = getToast(true, MSG_LOGIN.CONFIRM_EMAIL1, MSG_LOGIN.CONFIRM_EMAIL2);
        this.displayToast();
        this.rememberCreateAccount();
        this.loading = false;
        this.formSignUp.enable();
        setTimeout(() => {
          this.onChange.emit(true);
        }, 2500);
      }
    } else {
      this.formSignUp = this.formValidations.validateFormControls(this.formSignUp);
    }
  }
  displayToast() {
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 2500);
  }

  rememberCreateAccount() {
    if (this.formSignUp.get('remember').value) {
      this.fillUser();
      this.userValid.storeUserAccount(this.fillUser());
    } else {
      this.userValid.removeUserAccount();
    }
  }

  private fillUser(): ICadastroUsuario {
    return {
      Senha: this.formSignUp.get('password').value,
      Email: this.formSignUp.get('email').value,
    } as ICadastroUsuario;
  }

  showSignIn() {
    this.onChange.emit(true);
  }

  async onOpenForgotPassword() {
    const modal = await this.modalController.create({
      component: ForgotPasswordComponent,
      componentProps: {

      },
      backdropDismiss: false,
      cssClass: 'ms-modal forgot-password',
    });
    await modal.present();
  }
}
