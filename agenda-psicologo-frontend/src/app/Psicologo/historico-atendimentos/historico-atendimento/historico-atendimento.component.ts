import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historico-atendimento',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './historico-atendimento.component.html',
  styleUrls: ['./historico-atendimento.component.scss']
})
export class HistoricoAtendimentoComponent {
  @Input() atendimento!: { // Certifique-se de que o tipo de dado está correto
    inicio: string;
    fim: string;
    paciente: { username: string };
    status: string;
    id: number;
    presenca: boolean | null;
  };
}
