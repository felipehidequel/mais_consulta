export class Paciente {
  id: number;
  username: string;
  telefone: string;
  email: string;
  cpf: string;
  dataDeNascimento: Date;
  password: string;

  constructor(
    id: number,
    username: string,
    telefone: string,
    email: string,
    cpf: string,
    dataDeNascimento: Date,
    password: string,
    disponibilidade?: { id: number }
  ) {
    this.id = id;
    this.username = username;
    this.telefone = telefone;
    this.email = email;
    this.cpf = cpf;
    this.dataDeNascimento = dataDeNascimento;
    this.password = password;
  }
}
