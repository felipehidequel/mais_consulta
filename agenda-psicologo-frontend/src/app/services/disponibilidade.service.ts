import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DisponibilidadeService {
  private apiUrl = 'http://127.0.0.1:5000/disponibilidade';

  constructor(private http: HttpClient) {}

  getDisponibilidades(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  updateDisponibilidade(disponibilidadeId: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${disponibilidadeId}`, data);
  }
  

  removeDisponibilidade(pacienteId: number, disponibilidadeId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${disponibilidadeId}/paciente/${pacienteId}`);
  }

  atualizarDisponibilidade(disponibilidadeId: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${disponibilidadeId}`, data);
  }
}
