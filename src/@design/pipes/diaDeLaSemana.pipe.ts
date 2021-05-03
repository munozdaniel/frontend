import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'diaDeLaSemana' })
export class DiaDeLaSemanaPipe implements PipeTransform {
  /**
   * Transform
   *
   * @param value
   * @param {string[]} args
   * @returns {any}
   */
  transform(value: string, args: any[] = []): string {
     if (!value) {
      return '';
    }
    switch (value.toLowerCase()) {
      case 'monday':
        return 'Lunes';
      case 'tuesday':
        return 'Martes';
      case 'wednesday':
        return 'Miercoles';
      case 'thursday':
        return 'Jueves';
      case 'friday':
        return 'Viernes';
      case 'saturday':
        return 'Sabado';
      case 'sunday':
        return 'Domingo';

      default:
        return '';
    }
  }
}
