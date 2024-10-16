export class Psicologo {
  id?: number;
  username: string;
  password: string;
  telefone: string;
  email: string;
  crp: string;

  constructor(username: string, password: string, telefone: string, email: string, crp: string) {
    this.username = username;
    this.password = password;
    this.telefone = telefone;
    this.email = email;
    this.crp = crp;
  }
}