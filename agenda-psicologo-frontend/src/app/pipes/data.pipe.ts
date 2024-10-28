import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'data',
  standalone:true
})
export class DataPipe implements PipeTransform {
  transform(dataUtc?: string): string {
    if (!dataUtc) {
      return ''; // Retorna uma string vazia se a data for undefined
    }

    const data = new Date(dataUtc);

    // Ajuste para o fuso horário local
    const offset = data.getTimezoneOffset() * 60000; // Obtém o offset em milissegundos
    const dataLocal = new Date(data.getTime() + offset);

    // Formatação da data no formato DD/MM/YYYY
    const dia = String(dataLocal.getDate()).padStart(2, '0');
    const mes = String(dataLocal.getMonth() + 1).padStart(2, '0'); // Mês é 0-based
    const ano = dataLocal.getFullYear();

    return `${dia}/${mes}/${ano}`;
  }
}
