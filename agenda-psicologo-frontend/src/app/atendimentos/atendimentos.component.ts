import { Component } from '@angular/core';
import { AtendimentoComponent } from './atendimento/atendimento.component';

@Component({
  selector: 'app-atendimentos',
  standalone: true,
  imports: [AtendimentoComponent],
  templateUrl: './atendimentos.component.html',
  styleUrl: './atendimentos.component.scss'
})
export class AtendimentosComponent {

}
