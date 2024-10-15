import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConsultaService {
  private apiUrl = 'http://127.0.0.1:5000/consulta';

  constructor(private http: HttpClient) {}

  getConsultas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  createConsulta(consulta: any): Observable<any> {
    return this.http.post(this.apiUrl, consulta).pipe(catchError(this.handleError));
  }

  createMultipleConsultas(pacienteId: number, disponibilidadeId: number, disponibilidades: any[]): Observable<any>[] {
    const consultasObservables: Observable<any>[] = [];
    const disponibilidade = disponibilidades.find(d => d.id === disponibilidadeId);

    if (disponibilidade) {
      const currentDate = new Date();
      const currentDay = currentDate.getDay();
      const targetDay = this.getDayOfWeekIndex(disponibilidade.dia_semana);

      let firstConsultaDate = new Date(currentDate);
      firstConsultaDate.setDate(
        currentDate.getDate() + ((targetDay - currentDay + 7) % 7)
      );

      for (let i = 0; i < 10; i++) {
        const consultaDate = new Date(firstConsultaDate);
        consultaDate.setDate(firstConsultaDate.getDate() + i * 7);

        const consultaData = {
          data: consultaDate.toISOString().split('T')[0],
          inicio: disponibilidade.horario_inicio,
          fim: disponibilidade.horario_fim,
          paciente: pacienteId,
        };

        // Adiciona o observable à lista
        consultasObservables.push(this.createConsulta(consultaData));
      }
    }
    return consultasObservables;
  }

  private handleError(error: any): Observable<never> {
    console.error('Ocorreu um erro:', error);
    throw error; // Ou pode retornar um observable com um valor padrão
  }

  getDayOfWeekIndex(dia: string): number {
    const days = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
    return days.indexOf(dia.toLowerCase()); // Tornar a correspondência case insensitive
  }
}