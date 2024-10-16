import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Psicologo } from '../class/Psicologo';

@Injectable({
  providedIn: 'root'
})
export class PsicologoService {
  private apiUrl = 'http://127.0.0.1:5000/psicologo';

  constructor(private http: HttpClient) {}

  getPsicologos(): Observable<Psicologo[]> {
    return this.http.get<Psicologo[]>(this.apiUrl);
  }

  getPsicologo(id: number): Observable<Psicologo> {
    return this.http.get<Psicologo>(`${this.apiUrl}/${id}`);
  }

  createPsicologo(psicologo: Psicologo): Observable<Psicologo> {
    return this.http.post<Psicologo>(this.apiUrl, psicologo);
  }

  updatePsicologo(id: number, psicologo: Psicologo): Observable<Psicologo> {
    return this.http.put<Psicologo>(`${this.apiUrl}/${id}`, psicologo);
  }

  deletePsicologo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
