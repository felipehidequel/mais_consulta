import { Paciente } from "./Paciente";

export class Disponibilidade {
  id?: number;
  paciente: Paciente; // A propriedade 'paciente' é do tipo 'Paciente'
  dia_semana: string;
  horario_inicio: string;
  horario_fim: string;
  is_disponivel: boolean;

  constructor(paciente: Paciente, dia_semana: string, horario_inicio: string, horario_fim: string, is_disponivel: boolean) {
    this.paciente = paciente; // Atribui a instância do Paciente ao atributo 'paciente'
    this.dia_semana = dia_semana;
    this.horario_inicio = horario_inicio;
    this.horario_fim = horario_fim;
    this.is_disponivel = is_disponivel;
  }
}
