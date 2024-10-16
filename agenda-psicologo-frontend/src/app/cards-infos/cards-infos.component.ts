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
  
    console.log('Atendimentos recebidos:', this.atendimentos); // Adicione esta linha
  
    // Filtro dos atendimentos do dia atual
    this.quantidadeAtendimentos = this.atendimentos.filter(atendimento => {
      const dataAtendimento = new Date(atendimento.data); // Converte a data do atendimento
      return (
        dataAtendimento.getFullYear() === dataAtual.getFullYear() &&
        dataAtendimento.getMonth() === dataAtual.getMonth() &&
        dataAtendimento.getDate() === dataAtual.getDate()
      );
    }).length;
  
    console.log('Quantidade de atendimentos do dia:', this.quantidadeAtendimentos); // Adicione esta linha
  
    // Atualiza os horários disponíveis (padrão 8 menos os atendimentos do dia)
    this.quantidadeDisponiveis = 8 - this.quantidadeAtendimentos; // Corrigido aqui
  
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
  
    console.log('Pacientes atendidos:', this.pacientesAtendidos); // Adicione esta linha
  
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
  
    console.log('Pacientes ausentes:', this.pacientesAusentes); // Adicione esta linha
  }
}
