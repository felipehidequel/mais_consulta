import { Paciente } from "./Paciente";

export class Disponibilidade {
  id?: number;
  dia_semana: string;
  horario_inicio: string;
  horario_fim: string;
  is_disponivel: boolean;

  constructor( dia_semana: string, horario_inicio: string, horario_fim: string, is_disponivel: boolean) {
    this.dia_semana = dia_semana;
    this.horario_inicio = horario_inicio;
    this.horario_fim = horario_fim;
    this.is_disponivel = is_disponivel;
  }
}
