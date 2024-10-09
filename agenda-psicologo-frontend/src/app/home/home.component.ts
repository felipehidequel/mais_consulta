import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CardsInfosComponent } from '../cards-infos/cards-infos.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidebarComponent,CardsInfosComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
