import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Disponibilidade } from '../class/Disponibilidade';

@Injectable({
  providedIn: 'root'
})
export class DisponibilidadeService {
  private apiUrl = 'http://127.0.0.1:5000/disponibilidade';

  constructor(private http: HttpClient) {}

  getDisponibilidades(): Observable<Disponibilidade[]> {
    return this.http.get<Disponibilidade[]>(this.apiUrl);
  }

  getDisponibilidade(id: number): Observable<Disponibilidade> {
    return this.http.get<Disponibilidade>(`${this.apiUrl}/${id}`);
  }

  createDisponibilidade(disponibilidade: Disponibilidade): Observable<Disponibilidade> {
    return this.http.post<Disponibilidade>(this.apiUrl, disponibilidade);
  }

  updateDisponibilidade(id: number, disponibilidade: Disponibilidade): Observable<Disponibilidade> {
    return this.http.put<Disponibilidade>(`${this.apiUrl}/${id}`, disponibilidade);
  }

  deleteDisponibilidade(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
