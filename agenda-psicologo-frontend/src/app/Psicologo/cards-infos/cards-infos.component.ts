import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-cards-infos',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './cards-infos.component.html',
  styleUrls: ['./cards-infos.component.scss']
})
export class CardsInfosComponent implements OnInit, OnChanges {
  @Input() atendimentos: any[] = []; // Recebe atendimentos como input

  quantidadeAtendimentos: number = 0;
  quantidadeDisponiveis: number = 8; // Horários disponíveis por padrão
  pacientesAtendidos: number = 0;
  pacientesAusentes: number = 0;

  ngOnInit(): void {
    // Calcular estatísticas no ngOnInit, mas também no ngOnChanges
    this.calcularEstatisticas(); 
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Verifica se o valor de atendimentos mudou
    if (changes['atendimentos']) {
      this.calcularEstatisticas(); // Recalcula quando atendimentos mudar
    }
  }

  calcularEstatisticas() {
    const dataAtual = new Date(); // Data atual para comparar os atendimentos
  
    // Filtro dos atendimentos do dia atual
    this.quantidadeAtendimentos = this.atendimentos.filter(atendimento => {
      const [year, month, day] = atendimento.data.split('T')[0].split('-').map(Number); // Extrai ano, mês e dia
      const dataAtendimento = new Date(year, month - 1, day); // Mês no JavaScript é 0-indexado
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
      const [year, month, day] = atendimento.data.split('T')[0].split('-').map(Number); // Extrai ano, mês e dia
      const dataAtendimento = new Date(year, month - 1, day);
      return (
        dataAtendimento.getFullYear() === dataAtual.getFullYear() &&
        dataAtendimento.getMonth() === dataAtual.getMonth() &&
        dataAtendimento.getDate() === dataAtual.getDate() &&
        atendimento.presenca === true
      );
    }).length;
  
    // Contagem de pacientes ausentes (presença = false)
    this.pacientesAusentes = this.atendimentos.filter(atendimento => {
      const [year, month, day] = atendimento.data.split('T')[0].split('-').map(Number); // Extrai ano, mês e dia
      const dataAtendimento = new Date(year, month - 1, day);
      return (
        dataAtendimento.getFullYear() === dataAtual.getFullYear() &&
        dataAtendimento.getMonth() === dataAtual.getMonth() &&
        dataAtendimento.getDate() === dataAtual.getDate() &&
        atendimento.presenca === false
      );
    }).length;
  }
  
}
