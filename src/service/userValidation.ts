import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ICadastroUsuario, IUsuarioLogado, IValidacaoEmail } from 'src/app/shared/usuario/interfaces';
import { USUARIO } from 'src/app/shared/usuario/constants';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class UserValidation {

  private jwtHelper: JwtHelperService;

  constructor(readonly route: Router) {
    this.jwtHelper = new JwtHelperService();
  }

  // get isLoggedIn() {
  //   return !!this.getToken(USER.ACCESSTOKEN) && !this.isTokenExpired;
  // }

  // get isTokenExpired(): boolean {
  //   return this.jwtHelper.isTokenExpired(this.getToken(USER.ACCESSTOKEN));
  // }

  // get isFullUser(): boolean {
  //   return this.filledFields(this.authenticatedUser());
  // }

  getToken(tokenType) {
    return localStorage.getItem(tokenType);
  }

  getTokenEmail(): IValidacaoEmail {
    return JSON.parse(localStorage.getItem(USUARIO.ACESSO_TOKEN));
  }

  authenticatedUser(): IUsuarioLogado {
    return JSON.parse(localStorage.getItem(USUARIO.USUARIO_AUTENTICADO));
  }

  // updateAuthenticatedUserProfile(user) {
  //   localStorage.setItem(USER.AUTHENTICATED_USER, JSON.stringify(user));
  // }

  storageTokenEmail(token: IValidacaoEmail) {
    localStorage.setItem(USUARIO.ACESSO_TOKEN, JSON.stringify(token));
  }

  // storeUserSignIn(user: IUserSignIn) {
  //   localStorage.setItem(USER.USER_SIGN_IN, JSON.stringify(user));
  // }

  // getUserLogin() {
  //   return JSON.parse(localStorage.getItem(USER.USER_SIGN_IN));
  // }

  storeUserAccount(user: ICadastroUsuario) {
    localStorage.setItem(USUARIO.USUARIO_CADASTRO, JSON.stringify(user));
  }

  // getUserAccount() {
  //   return JSON.parse(localStorage.getItem(USER.USER_CREATE_ACCOUNT));
  // }

  storeToken(response: any) {
    const token = { accessToken: response.accessToken };
    localStorage.setItem(USUARIO.ACESSO_TOKEN, JSON.stringify(token));
    localStorage.setItem(USUARIO.USUARIO_AUTENTICADO, JSON.stringify(response.user));
  }


  // filledFields = (user: IAuthenticatedUser): boolean => {
  //   return !!user.relocationStatus && !!user.destinationCityId;
  // }

  removeUserAccount() {
    localStorage.removeItem(USUARIO.USUARIO_AUTENTICADO);
  }

  // removeUserSignIn() {
  //   localStorage.removeItem(USER.USER_SIGN_IN);
  // }

  // clearUserInformation() {
  //   localStorage.removeItem(USER.ACCESSTOKEN);
  //   localStorage.removeItem(USER.AUTHENTICATED_USER);
  // }
}
