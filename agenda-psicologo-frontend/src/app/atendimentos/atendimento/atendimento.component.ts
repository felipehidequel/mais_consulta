import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Atendimento {
  inicio: string;
  fim: string;
  paciente: { username: string };
  status: string;
  id: number;
  presenca: boolean | null; 
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

  atualizarPresenca(atendimentoId: number, statusPresenca: boolean) {
    if (this.atendimento) {
      const apiUrl = `http://127.0.0.1:5000/consulta/${atendimentoId}`;
  
      // Atualiza localmente antes de enviar
      this.atendimento.presenca = statusPresenca;

      // Enviando um objeto com a propriedade presenca
      const updatedAtendimento = {
        presenca: statusPresenca
      };

      console.log('Enviando dados:', updatedAtendimento);

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
