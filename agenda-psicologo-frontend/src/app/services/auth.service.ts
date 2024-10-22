import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Paciente } from '../class/Paciente'; // Certifique-se de que o caminho está correto

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = 'http://127.0.0.1:5000/paciente';
  private pacienteId: number | null = null;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<Paciente | null> {
    return this.http.get<Paciente[]>(this.apiUrl).pipe(
      map(pacientes => {
        const paciente = pacientes.find(p => p.email === email && p.password === password);
        if (paciente) {
          this.pacienteId = paciente.id; // Armazena o ID do paciente para futuras pesquisas
          return paciente; // Retorna o paciente encontrado
        }
        return null; // Retorna null se o paciente não for encontrado
      })
    );
  }

  getPacienteId(): number | null {
    return this.pacienteId;
  }
}
