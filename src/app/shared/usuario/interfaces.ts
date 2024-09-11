export interface IUsuario {
  id: number;
  nome: string;
  perfilId: number;
  unidadeId?: number;
  nomeUnidade: string;
  senhaTemporaria: boolean;
}

export interface IUsuarioLogado {
  id: number;
  nome: string;
  senhaTemporaria: boolean;
  statusId: number;
  tipoId: number;
}

export interface ILogin {
  Email: string;
  Senha: string;
}

export interface ICadastroUsuario {
  Email: string;
  Senha: string;
  Nome: string;
}

export interface IValidacaoEmail {
  Email: string;
}

export interface IUsuarioRecuperarSenha {
  novaSenha: string;
  confirmarcaoNovaSenha: string;
}