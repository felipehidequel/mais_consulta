import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http'; // Adicione o HttpClientModule
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), // Certifique-se de que o HttpClientModule está sendo fornecido
    provideRouter(routes), // Provedor do roteador
    provideAnimationsAsync(), // Provedor de animações
  ]
}).catch(err => console.error(err));
