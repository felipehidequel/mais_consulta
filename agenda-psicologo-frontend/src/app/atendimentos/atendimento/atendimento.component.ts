import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Disponibilidade } from '../../class/Disponibilidade';
import { Paciente } from '../../class/Paciente';
interface Atendimento {
  inicio: string;
  fim: string;
  paciente: Paciente;
  status: string;
  id: number;
  data: Date;
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
  ngOnInit() {
    console.log('Paciente:', this.atendimento?.disponibilidade?.paciente?.username);
  }

  constructor(private http: HttpClient) { }

  // Método para atualizar a presença do atendimento
  atualizarPresenca(atendimentoId: number, statusPresenca: boolean) {
    if (this.atendimento) {
      console.log('Paciente:', this.atendimento.paciente); // Log do objeto paciente

      const apiUrl = `http://127.0.0.1:5000/consulta/${atendimentoId}`;
  
      this.atendimento.presenca = statusPresenca;

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
