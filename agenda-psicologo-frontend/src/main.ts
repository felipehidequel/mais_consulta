import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http'; // Importa suporte ao HttpClient
import { provideRouter } from '@angular/router'; // Importa suporte para roteamento
import { AppComponent } from './app/app.component'; // Componente principal
import { routes } from './app/app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // Suas rotas

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), // Provedor para realizar requisições HTTP
    provideRouter(routes), provideAnimationsAsync(), // Provedor de rotas
  ]
}).catch(err => console.error(err));
