export class Paciente {
  id: number;
  username: string;
  telefone: string;
  email: string;
  cpf: string;
  dataDeNascimento: Date;
  password: string;
  disponibilidade?: { id: number }; // Inclua a propriedade 'disponibilidade'

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
    this.disponibilidade = disponibilidade;
  }
}
