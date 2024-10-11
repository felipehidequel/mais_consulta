import { Component } from '@angular/core';
import { HistoricoAtendimentoComponent } from './historico-atendimento/historico-atendimento.component';
@Component({
  selector: 'app-historico-atendimentos',
  standalone: true,
  imports: [HistoricoAtendimentoComponent],
  templateUrl: './historico-atendimentos.component.html',
  styleUrl: './historico-atendimentos.component.scss'
})
export class HistoricoAtendimentosComponent {

}
