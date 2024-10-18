import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Importa o módulo de roteamento
import { HomeComponent } from './home/home.component';
@Component({
  selector: 'app-root',
  standalone: true,  // Define como componente standalone
  imports: [RouterModule,HomeComponent],  // Importa o módulo de roteamento para usar links e router-outlet
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'meu-app';
}
