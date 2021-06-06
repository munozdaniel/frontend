import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'spliturl' })
export class SplitUrlPipe implements PipeTransform {
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
    const arreglo = value.split('/');
    return arreglo && arreglo.length > 0 ? arreglo[arreglo.length - 1] : '';
  }
}
