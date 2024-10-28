import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Importação para usar o operador map
import { CommonModule } from '@angular/common';
import { HistoricoAtendimentoComponent } from './historico-atendimento/historico-atendimento.component';
import { Consulta } from '../../class/Consulta';

@Component({
  selector: 'app-historico-atendimentos',
  standalone: true,
  imports: [HistoricoAtendimentoComponent, CommonModule],
  templateUrl: './historico-atendimentos.component.html',
  styleUrls: ['./historico-atendimentos.component.scss']
})
export class HistoricoAtendimentosComponent implements OnInit {
  atendimentos: Consulta[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getAtendimentos().pipe(
      map((data: Consulta[]) => {
        const hoje = new Date();
        
        // Filtrar e mapear os dados para adicionar as propriedades esperadas
        return data
          .filter(atendimento => {
            const [year, month, day] = atendimento.data.split('T')[0].split('-').map(Number);
            const dataAtendimento = new Date(year, month - 1, day);

            return (
              dataAtendimento.getDate() === hoje.getDate() &&
              dataAtendimento.getMonth() === hoje.getMonth() &&
              dataAtendimento.getFullYear() === hoje.getFullYear()
            );
          })
          .map(atendimento => ({
            ...atendimento,
            inicio: '', // Defina valores padrão
            fim: '',
            paciente: {
              ...atendimento.paciente,
              username: atendimento.paciente.username || '' // Nome de usuário do paciente
            }
          }));
      })
    ).subscribe(
      (atendimentosFiltrados: Consulta[]) => {
        this.atendimentos = atendimentosFiltrados;
      },
      (error) => {
        console.error('Erro ao obter atendimentos:', error);
      }
    );
  }

  getAtendimentos(): Observable<Consulta[]> {
    const apiUrl = 'http://127.0.0.1:5000/consulta';
    return this.http.get<Consulta[]>(apiUrl);
  }
}
