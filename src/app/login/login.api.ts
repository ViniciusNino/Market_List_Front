import { Injectable } from '@angular/core';
import { LOGIN } from './login.endpoints';
import { ICadastroUsuario, IUsuario, IUsuarioRecuperarSenha } from '../shared/usuario/interfaces';
import { formatUrl } from 'src/utils/string.utils';
import { HttpProvider } from '../shared/providers/http.providers';

@Injectable({
  providedIn: 'root',
})
export class LoginApi {
  constructor(readonly http: HttpProvider) {}

  async getValidateToken(token: string): Promise<any> {

    const url = formatUrl(LOGIN.GET_VALIDATE_VERIFICATION_TOKEN, [token]);

    return this.http.get<any>(url).toPromise();
  }

  async getValidateEmailToken(token: string): Promise<any> {

    const url = formatUrl(LOGIN.GET_VALIDATE_EMAIL_VERIFICATION_TOKEN, [token]);

    return this.http.get<any>(url).toPromise();
  }

  async postAuthenticatedUser(user: any): Promise<IUsuario> {
    const response = this.http
      .post<IUsuario>(LOGIN.POST_LOGIN, user)
      .toPromise();
    return response;
  }

  async postCreateAccount(user: ICadastroUsuario): Promise<any> {
    return this.http.post<any>(LOGIN.POST_CREATE_ACCOUNT, user).toPromise();
  }

  async postForgotPassword(email: string): Promise<boolean> {
    return this.http
      .post<boolean>(LOGIN.POST_SEND_EMAIL_PASSWORD, email)
      .toPromise();
  }

  async postResendEmail(email: string): Promise<boolean> {

    return this.http.post<boolean>(LOGIN.POST_SEND_EMAIL_VERIFICATION, email).toPromise();
  }

  async putResetPassword(token: string, userPassword: IUsuarioRecuperarSenha): Promise<any> {

    const url = formatUrl(LOGIN.PATCH_UPDATE_PASSWORD, [token]);

    return this.http.patch(url, userPassword).toPromise();
  }
}
