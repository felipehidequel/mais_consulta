import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CardsInfosComponent } from '../cards-infos/cards-infos.component';
import { AtendimentosComponent } from '../atendimentos/atendimentos.component';
import { HistoricoAtendimentosComponent } from '../historico-atendimentos/historico-atendimentos.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidebarComponent,CardsInfosComponent,AtendimentosComponent,HistoricoAtendimentosComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
