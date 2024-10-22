import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Consulta } from '../../class/Consulta';
import { CommonModule } from '@angular/common';
import { ConsultaService } from '../../services/consulta.service';
import { CardConsltaComponent } from '../card-conslta/card-conslta.component';

@Component({
  selector: 'app-confirmacao',
  standalone: true,
  imports: [CommonModule, CardConsltaComponent],
  templateUrl: './confirmacao.component.html',
  styleUrls: ['./confirmacao.component.scss']
})
export class ConfirmacaoComponent implements OnInit {
  pacienteId: number | null = null;
  pacienteNome: string | null = null;
  atendimentos: Consulta[] = [];
  firstAgendado: Consulta | null = null; // Nova propriedade para armazenar o primeiro agendado

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private consultaService: ConsultaService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['id'] && params['username']) {
        this.pacienteId = +params['id'];
        this.pacienteNome = params['username'];

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {},
          replaceUrl: true
        });
      }
    });

    if (this.pacienteId) {
      this.consultaService.getConsultaByPacienteId(this.pacienteId).subscribe(
        (data: Consulta[]) => {
          this.atendimentos = data.sort((a, b) => {
            const dateA = new Date(a.data); // Certifique-se de que 'data' é um campo de data
            const dateB = new Date(b.data);
            return dateA.getTime() - dateB.getTime(); // Ordenação ascendente
          });
          this.firstAgendado = this.atendimentos.find(atendimento => atendimento.status === 'AGENDADO') || null;
        },
        (error) => {
          console.error('Erro ao obter atendimentos:', error);
        }
      );
    }
  }

  handleStatusAtualizado(updatedAtendimento: Consulta) {
    console.log('Status do atendimento atualizado:', updatedAtendimento);

    // Atualiza o atendimento no array
    const index = this.atendimentos.findIndex(atendimento => atendimento.id === updatedAtendimento.id);
    if (index !== -1) {
      this.atendimentos[index] = updatedAtendimento; // Atualiza o atendimento no array
    }

    // Verifica se o atendimento atualizado é o primeiro agendado e, se necessário, atualiza a referência
    if (this.firstAgendado?.id === updatedAtendimento.id) {
      this.firstAgendado = updatedAtendimento; // Atualiza a referência se necessário
    }
  }
}
