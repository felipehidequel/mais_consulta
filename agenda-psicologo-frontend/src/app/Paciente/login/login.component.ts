import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.authService.login(this.username, this.password).subscribe(
      (paciente) => {
        if (paciente) {
          // Redireciona para a rota /pacientes com o ID do paciente
          this.router.navigate(['/confirmacao'], { queryParams: { ...paciente } });
        } else {
          this.errorMessage = 'Usuário ou senha inválidos!';
        }
      },
      (error) => {
        this.errorMessage = 'Erro ao fazer login.';
        console.error(error);
      }
    );
  }
}
