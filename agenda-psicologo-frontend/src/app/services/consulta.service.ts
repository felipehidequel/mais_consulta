import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Consulta } from '../class/Consulta';
import { Paciente } from '../class/Paciente';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {
  private apiUrl = 'http://127.0.0.1:5000/consulta';

  constructor(private http: HttpClient) { }

  getConsultas(): Observable<Consulta[]> {
    return this.http.get<Consulta[]>(this.apiUrl);
  }

  getConsulta(id: number): Observable<Consulta> {
    return this.http.get<Consulta>(`${this.apiUrl}/${id}`);
  }

  createConsulta(consulta: { data: string; disponibilidade: { id: number; is_disponivel: boolean }; paciente: Paciente }): Observable<Consulta> {
    return this.http.post<Consulta>(this.apiUrl, consulta);
  }

  updateConsulta(id: number, consulta: Consulta): Observable<Consulta> {
    return this.http.put<Consulta>(`${this.apiUrl}/${id}`, consulta);
  }

  deleteAllConsultas(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/all`);
  }

  getConsultaByPacienteId(pacienteId: number): Observable<Consulta[]> { 
    return this.http.get<Consulta[]>(`${this.apiUrl}/consulta/paciente/${pacienteId}`);
  }
}
