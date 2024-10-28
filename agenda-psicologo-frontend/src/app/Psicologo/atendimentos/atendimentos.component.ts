import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AtendimentoComponent } from './atendimento/atendimento.component';
import { CommonModule } from '@angular/common';
import { Consulta } from '../../class/Consulta';


@Component({
  selector: 'app-atendimentos',
  standalone: true,
  imports: [CommonModule, AtendimentoComponent],
  templateUrl: './atendimentos.component.html',
  styleUrls: ['./atendimentos.component.scss']
})
export class AtendimentosComponent implements OnInit {
  atendimentos: Consulta[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getAtendimentos().subscribe(
      (data: Consulta[]) => {
        const hoje = new Date();  // Data atual no fuso horário local
        
        this.atendimentos = data.filter(atendimento => {
          // Extraindo a data e criando um novo objeto de Date sem fuso horário
          const [year, month, day] = atendimento.data.split('T')[0].split('-').map(Number);
          const dataAtendimento = new Date(year, month - 1, day); // Mês no JavaScript é 0-based
  
          return (
            dataAtendimento.getDate() === hoje.getDate() &&
            dataAtendimento.getMonth() === hoje.getMonth() &&
            dataAtendimento.getFullYear() === hoje.getFullYear()
          );
        });
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
