import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PacienteService {
  private apiUrl = 'http://127.0.0.1:5000/paciente';

  constructor(private http: HttpClient) {}

  getPacientes(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(catchError(this.handleError));
  }

  getPaciente(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  createPaciente(paciente: any): Observable<any> {
    return this.http.post(this.apiUrl, paciente).pipe(catchError(this.handleError));
  }

  updatePaciente(id: number, paciente: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, paciente).pipe(catchError(this.handleError));
  }

  deletePaciente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('Ocorreu um erro:', error);
    throw error; // Ou pode retornar um observable com um valor padrão
  }
}
