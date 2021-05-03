import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'fechaADia' })
export class FechaADiaPipe implements PipeTransform {
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
    const fechaNombre = moment.utc(value).format('dddd').toLowerCase();

    switch (fechaNombre) {
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
