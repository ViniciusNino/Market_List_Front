import { ValidateEmailComponent } from './validate-email/validate-email.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPage } from './login.page';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  },
  {
    path: 'validate-email/:token',
    component: ValidateEmailComponent
  },
  {
    path: 'reset-password/:token',
    component: ResetPasswordComponent
  }
  // {path: '**', redirectTo: '',  pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}
