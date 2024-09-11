import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ValidateEmailComponent } from './validate-email/validate-email.component';
import { ToastModule } from './../../service/toast/toast.module';
import { LoaderModule } from './../../service/loader/loader.module';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { LoginPageRoutingModule } from './login-routing.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginPage } from './login.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    ReactiveFormsModule,
    LoaderModule,
    ToastModule
  ],
  declarations: [
    LoginPage,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    ValidateEmailComponent,
    ResetPasswordComponent
  ]
})
export class LoginPageModule {}
