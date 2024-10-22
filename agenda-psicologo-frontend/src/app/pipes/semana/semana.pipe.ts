import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'semana',
  standalone: true  // Isso permite que o pipe seja usado diretamente em standalone components

})
export class SemanaPipe implements PipeTransform {

  private diasSemana: { [key: string]: string } = {
    'segunda': 'Segunda-Feira',
    'terca': 'Terça-Feira',
    'quarta': 'Quarta-Feira',
    'quinta': 'Quinta-Feira',
    'sexta': 'Sexta-Feira',
    'sabado': 'Sábado',
    'domingo': 'Domingo'
  };

  transform(value: string): string {
    // Normaliza o valor para minúsculas e remove espaços desnecessários
    const diaNormalizado = value.trim().toLowerCase();

    // Retorna o dia completo se encontrado, senão retorna o próprio valor
    return this.diasSemana[diaNormalizado] || value;
  }

}
