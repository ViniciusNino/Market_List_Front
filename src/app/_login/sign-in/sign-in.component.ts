import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ROUTES_COMPONENTS } from 'src/app/app-const.route';
import { getToast } from 'src/app/shared/toast/constants';
import { IToast } from 'src/app/shared/toast/interface';
import { TipoPerfilUsuario } from 'src/app/shared/usuario/enums';
import { IUsuarioLogado } from 'src/app/shared/usuario/interfaces';
import { LoginApi } from '../login.api';
import { SenhaTempComponent } from '../senha-temp/senha-temp.component';
import { UtilUsuario } from './../../../service/util-usuario';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  public usuario: IUsuarioLogado;
  public onLoginForm: FormGroup;
  loading: boolean = false;
  toast: IToast = getToast();
  showToast = false;

  constructor(
    private readonly router: Router,
    private readonly loginApi: LoginApi,
    private readonly utilUsuario: UtilUsuario,
    private readonly formBuilder: FormBuilder,
    private readonly modalController: ModalController
  ) {}

  ngOnInit() {
    this.createFormLogin();
  }

  createFormLogin() {
    this.onLoginForm = this.formBuilder.group({
      Email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
      ],
      Senha: [null, Validators.compose([Validators.required])],
    });
  }

  goToRegister() {
    this.router.navigateByUrl(ROUTES_COMPONENTS.SIGN_UP);
  }

  goToHome() {
    this.router.navigateByUrl('/home-results');
  }

  async signIn() {
    this.loading = true;
    const result = await this.loginApi
      .getUsuarioAutenticado(this.onLoginForm.value)
      .catch((error) => {
        const errorMessage = error.split(', ');
        this.displayToast(false, 'Erro ao Logar!', errorMessage[1]);
        this.loading = false;
        return null;
      });
    if (result.response) {
      this.utilUsuario.autenticarUsuario(result.response);
      this.usuario = result.response.usuario;
      if (this.usuario.tipoId == TipoPerfilUsuario.Solicitante) {
        this.router.navigateByUrl(ROUTES_COMPONENTS.HOME_SOLICITANTE);
      } else {
        this.router.navigateByUrl(ROUTES_COMPONENTS.HOME);
      }
    } else {
      alert('Usuário ou Senha Inválido');
    }
    this.loading = false;
  }

  async abrirModal() {
    const modal = await this.modalController.create({
      component: SenhaTempComponent,
      componentProps: {},
      backdropDismiss: false,
      cssClass: 'ms-modal',
    });
    await modal.present();
    modal.onDidDismiss().then((result) => {
      if (result.data?.email) {
      }
    });
  }

  async solicitarSenhaTemporaria(email: string) {
    this.loading = true;
    const result = await this.loginApi
      .solicitarSenhaTemporaria(email)
      .catch((error) => {
        const errorMessage = error.split(', ');
        this.displayToast(false, 'Erro ao solicitar senha', errorMessage[1]);
        this.loading = false;
        return null;
      });
    if (result.response) {
      this.displayToast(
        true,
        'Solicitação de senha!',
        'Senha solicitada com sucesso, Verifique sua caixa de email para obter sua senha temporária.'
      );
      this.loading = false;
    }
  }

  displayToast(sucess: boolean, title: string, notes: string) {
    this.toast = getToast(sucess, title, notes);
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3500);
  }
}
