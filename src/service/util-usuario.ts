import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { USUARIO } from 'src/app/shared/usuario/constants';

@Injectable({
  providedIn: 'root',
})
export class UtilUsuario {
  private jwtHelper: JwtHelperService;

  constructor(readonly route: Router) {
    this.jwtHelper = new JwtHelperService();
  }

  get logado() {
    return !!this.getToken(USUARIO.ACESSO_TOKEN) && !this.tokenExpirado;
  }

  get tokenExpirado(): boolean {
    return this.jwtHelper.isTokenExpired(this.getToken(USUARIO.ACESSO_TOKEN));
  }

  getToken(tokenType) {
    return localStorage.getItem(tokenType);
  }

  autenticarUsuario(response: any) {
    const token = { acessoToken: response.tokenAcesso };
    localStorage.setItem(USUARIO.ACESSO_TOKEN, JSON.stringify(token));
    localStorage.setItem(
      USUARIO.USUARIO_AUTENTICADO,
      JSON.stringify(response.usuario)
    );
  }
}
