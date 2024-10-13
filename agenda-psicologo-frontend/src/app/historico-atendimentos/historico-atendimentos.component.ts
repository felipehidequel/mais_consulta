import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HistoricoAtendimentoComponent } from './historico-atendimento/historico-atendimento.component';

export interface Atendimento {
  id: number;
  inicio: string;
  fim: string;
  paciente: {
    username: string;
  };
  status: string;
  presenca: boolean | null;
}

@Component({
  selector: 'app-historico-atendimentos',
  standalone: true,
  imports: [HistoricoAtendimentoComponent, CommonModule],
  templateUrl: './historico-atendimentos.component.html',
  styleUrls: ['./historico-atendimentos.component.scss'] // Corrigido 'styleUrl' para 'styleUrls'
})
export class HistoricoAtendimentosComponent implements OnInit {
  atendimentos: Atendimento[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getAtendimentos().subscribe(
      (data: Atendimento[]) => {
        this.atendimentos = data;
      },
      (error) => {
        console.error('Erro ao obter atendimentos:', error);
      }
    );
  }

  getAtendimentos(): Observable<Atendimento[]> {
    const apiUrl = 'http://127.0.0.1:5000/consulta';
    return this.http.get<Atendimento[]>(apiUrl);
  }
}
