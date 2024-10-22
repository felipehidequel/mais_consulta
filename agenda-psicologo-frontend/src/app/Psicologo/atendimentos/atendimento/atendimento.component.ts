import { Paciente } from '../../../class/Paciente';
import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Disponibilidade } from '../../../class/Disponibilidade';
import { Consulta } from '../../../class/Consulta';

interface Atendimento {
  inicio: string;
  fim: string;
  paciente: Paciente;
  status: string;
  id: number;
  presenca: boolean | null;
  disponibilidade?: Disponibilidade;
}

@Component({
  selector: 'app-atendimento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './atendimento.component.html',
  styleUrls: ['./atendimento.component.scss']
})
export class AtendimentoComponent {
  @Input() atendimento: Atendimento | null = null;

  constructor(private http: HttpClient) { }

  // Método para atualizar a presença do atendimento
  atualizarPresenca(atendimentoId: number, statusPresenca: boolean) {
    if (this.atendimento) {

      const apiUrl = `http://127.0.0.1:5000/consulta/${atendimentoId}`;

      this.atendimento.presenca = statusPresenca;
      
      const updatedAtendimento = {
        presenca: statusPresenca,
        quantidadeConsulta: this.atendimento.paciente.quantidadeConsulta += 1
      };

      this.http.put(apiUrl, updatedAtendimento).subscribe(
        response => {
          console.log('Status atualizado com sucesso:', response);
        },
        error => {
          console.error('Erro ao atualizar status:', error);
        }
      );
    } else {
      console.error('Atendimento não definido.');
    }
  }
}
