import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Consulta } from '../../class/Consulta';
import { ConsultaService } from '../../services/consulta.service';

@Component({
  selector: 'app-card-conslta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-conslta.component.html',
  styleUrls: ['./card-conslta.component.scss']
})
export class CardConsltaComponent {
  @Input() atendimento: Consulta | null = null;
  @Output() statusAtualizado = new EventEmitter<Consulta>();
  @Input() isFirstAgendado: boolean = false; // Nova propriedade para verificar se é o primeiro agendado

  constructor(private consultaService: ConsultaService) {}

  atualizarConsulta(atendimentoId?: number, statusConsulta?: string, presenca?:boolean ) {
    if (this.atendimento && typeof statusConsulta === 'string') {
      const updatedAtendimento: Consulta = {
        ...this.atendimento,
        status: statusConsulta,
        presenca: presenca,
      };

      if (atendimentoId !== undefined) {
        this.consultaService.updateConsulta(atendimentoId, updatedAtendimento).subscribe(
          response => {
            console.log('Status atualizado com sucesso:', response);
            this.statusAtualizado.emit(updatedAtendimento);
          },
          error => {
            console.error('Erro ao atualizar status:', error);
          }
        );
      } else {
        console.error('atendimentoId não está definido.');
      }
    } else {
      console.error('Atendimento não definido ou statusConsulta não é uma string.');
    }
  }
}
