import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface Disponibilidade {
  data: string;
  horario_inicio: string;
  horario_fim: string;
  dia_semana: string;
}

@Injectable({
  providedIn: 'root',
})
export class DisponibilidadeService {
  private apiUrl = 'http://localhost:5000/disponibilidade';
  private psicologo = 'Nome do Psicólogo'; // Substitua pelo nome real

  constructor(private http: HttpClient) {}

  getDisponibilidades(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  private generateDisponibilidades(): Disponibilidade[] { // Anotação de tipo explícita
    const disponibilidades: Disponibilidade[] = []; // Anotação de tipo explícita
    const dias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
    const inicio = 8; // 8h
    const fim = 18; // 18h
    const intervaloAlmoco = 2; // 2h
    const duracao = 50; // 50 min
    const intervaloEntre = 10; // 10 min

    const hoje = new Date();
    const diaAtual = hoje.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    const diasDaSemana = {
      1: 'Segunda',
      2: 'Terça',
      3: 'Quarta',
      4: 'Quinta',
      5: 'Sexta'
    };

    dias.forEach((dia, index) => {
      const diaOffset = index + 1; // Segunda = 1, Terça = 2, etc.
      if (diaOffset > diaAtual) {
        const data = new Date();
        data.setDate(hoje.getDate() + (diaOffset - diaAtual)); // Ajusta a data para o dia da semana
        this.createHorarios(disponibilidades, data, dia, inicio, fim, duracao, intervaloEntre, intervaloAlmoco);
      }
    });

    return disponibilidades;
  }

  private createHorarios(disponibilidades: Disponibilidade[], data: Date, dia: string, inicio: number, fim: number, duracao: number, intervaloEntre: number, intervaloAlmoco: number) {
    for (let hora = inicio; hora < fim; hora++) {
      const horarios = [
        { start: hora, end: hora + duracao / 60 },
        { start: hora + duracao / 60 + intervaloEntre / 60, end: hora + 2 * (duracao / 60) + intervaloEntre / 60 },
        { start: hora + 2 * (duracao / 60) + intervaloEntre / 60 + intervaloAlmoco, end: hora + 2 * (duracao / 60) + intervaloEntre / 60 + intervaloAlmoco + duracao / 60 },
      ];

      for (const { start } of horarios) {
        const horarioInicio = new Date(data);
        horarioInicio.setHours(start, 0, 0, 0); // Definindo a hora
        const formattedData = data.toISOString().split('T')[0];
        const horarioInicioStr = horarioInicio.toTimeString().split(' ')[0]; // formato HH:mm:ss
        const horarioFim = new Date(horarioInicio);
        horarioFim.setMinutes(horarioInicio.getMinutes() + duracao); // Adiciona a duração

        disponibilidades.push({ 
          data: formattedData, 
          horario_inicio: horarioInicioStr, 
          horario_fim: horarioFim.toTimeString().split(' ')[0], 
          dia_semana: dia 
        });
      }
    }
  }

  public enviarDisponibilidades(): void {
    const disponibilidades = this.generateDisponibilidades();
    const requests: Observable<any>[] = [];

    disponibilidades.forEach((disponibilidade) => {
      const existe = this.http.get(`${this.apiUrl}?data=${disponibilidade.data}&horario_inicio=${disponibilidade.horario_inicio}`).pipe(
        map((res: any) => {
          if (!res.length) { // Se não existir, envia para a API
            return this.http.post(this.apiUrl, {
              psicologo: this.psicologo,
              data: disponibilidade.data,
              horario_inicio: disponibilidade.horario_inicio,
              horario_fim: disponibilidade.horario_fim,
              dia_semana: disponibilidade.dia_semana
            });
          }
          return of(null); // Se existir, não faz nada
        }),
        catchError(() => of(null)) // Captura erro e retorna null
      );

      requests.push(existe);
    });

    // Execute todas as requisições
    forkJoin(requests).subscribe(results => {
      results.forEach(result => {
        if (result) {
          console.log('Disponibilidade enviada:', result);
        }
      });
    }, error => {
      console.error('Erro ao enviar disponibilidades:', error);
    });
  }
}
