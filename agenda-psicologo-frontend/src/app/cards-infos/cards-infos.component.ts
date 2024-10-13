import { Component, OnInit, Input } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-cards-infos',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './cards-infos.component.html',
  styleUrls: ['./cards-infos.component.scss']
})
export class CardsInfosComponent implements OnInit {
  @Input() atendimentos: any[] = []; // Recebe atendimentos como input

  quantidadeAtendimentos: number = 0;
  quantidadeDisponiveis: number = 8; // Horários disponíveis por padrão
  pacientesAtendidos: number = 0;
  pacientesAusentes: number = 0;

  ngOnInit(): void {
    this.calcularEstatisticas(); // Chama a função para calcular as estatísticas
  }

  calcularEstatisticas() {
    const dataAtual = new Date(); // Data atual para comparar os atendimentos

    // Filtro dos atendimentos do dia atual
    this.quantidadeAtendimentos = this.atendimentos.filter(atendimento => {
      const dataAtendimento = new Date(atendimento.data); // Converte a data do atendimento
      return (
        dataAtendimento.getFullYear() === dataAtual.getFullYear() &&
        dataAtendimento.getMonth() === dataAtual.getMonth() &&
        dataAtendimento.getDate() === dataAtual.getDate()
      );
    }).length;

    // Atualiza os horários disponíveis (padrão 8 menos os atendimentos do dia)
    this.quantidadeDisponiveis = 8 - this.quantidadeAtendimentos;

    // Contagem de pacientes atendidos (presença = true)
    this.pacientesAtendidos = this.atendimentos.filter(atendimento => {
      const dataAtendimento = new Date(atendimento.data); // Filtro por data do atendimento
      return (
        dataAtendimento.getFullYear() === dataAtual.getFullYear() &&
        dataAtendimento.getMonth() === dataAtual.getMonth() &&
        dataAtendimento.getDate() === dataAtual.getDate() &&
        atendimento.presenca === true // Apenas pacientes presentes
      );
    }).length;

    // Contagem de pacientes ausentes (presença = false)
    this.pacientesAusentes = this.atendimentos.filter(atendimento => {
      const dataAtendimento = new Date(atendimento.data); // Filtro por data do atendimento
      return (
        dataAtendimento.getFullYear() === dataAtual.getFullYear() &&
        dataAtendimento.getMonth() === dataAtual.getMonth() &&
        dataAtendimento.getDate() === dataAtual.getDate() &&
        atendimento.presenca === false // Apenas pacientes ausentes
      );
    }).length;
  }
}
