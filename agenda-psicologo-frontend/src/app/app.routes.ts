import { Routes } from '@angular/router';
import { HomeComponent } from './Psicologo/home/home.component';
import { PacientesComponent } from './Psicologo/pacientes/pacientes.component';
import { ConfirmacaoComponent } from './Paciente/confirmacao/confirmacao.component';
import { LoginComponent } from './Paciente/login/login.component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'pacientes', component: PacientesComponent },
  { path: 'confirmacao', component: ConfirmacaoComponent, canActivate: [AuthGuard] }, // Protegendo a rota
  { path: 'login', component: LoginComponent }
];
