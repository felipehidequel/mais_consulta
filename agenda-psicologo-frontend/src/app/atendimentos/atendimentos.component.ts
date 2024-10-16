import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AtendimentoComponent } from './atendimento/atendimento.component';
import { CommonModule } from '@angular/common';
import { Paciente } from '../class/Paciente';

interface Atendimento {
  inicio: string;
  fim: string;
  paciente: Paciente;
  status: string;
  id: number;
  presenca: boolean | null;
}
@Component({
  selector: 'app-atendimentos',
  standalone: true,
  imports: [CommonModule, AtendimentoComponent],
  templateUrl: './atendimentos.component.html',
  styleUrls: ['./atendimentos.component.scss']
})
export class AtendimentosComponent implements OnInit {
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
