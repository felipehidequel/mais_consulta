export class Consulta {
  id?: number;
  paciente: number;
  status: string;
  data: string;
  disponibilidade: number;
  presenca?: boolean;

  constructor(paciente: number, status: string, data: string, disponibilidade: number, presenca?: boolean) {
    this.paciente = paciente;
    this.status = status; // Adicionando a inicialização da propriedade 'status'
    this.data = data;
    this.disponibilidade = disponibilidade;
    this.presenca = presenca;
  }
}