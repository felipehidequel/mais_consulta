import { Disponibilidade } from "./Disponibilidade";
import { Paciente } from "./Paciente";

export class Consulta {
  id?: number;
  paciente: Paciente;
  status: string;
  data: string;
  disponibilidade: Disponibilidade;
  presenca?: boolean | null;

  constructor(paciente: Paciente, status: string, data: string, disponibilidade: Disponibilidade, presenca?: boolean) {
    this.paciente = paciente;
    this.status = status;
    this.data = data;
    this.disponibilidade = disponibilidade;
    this.presenca = presenca;
  }
}