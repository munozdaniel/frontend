import { Injectable } from '@angular/core';
import { IAlumno } from 'app/models/interface/iAlumno';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ScriptService } from '../plugins/script-excel.service';
declare let pdfMake: any;
@Injectable({
  providedIn: 'root',
})
export class AlumnosPromediosPdf {
  calificacionesPorAlumno: any[];
  alumno: IAlumno;
  constructor(private scriptService: ScriptService) {
    this.scriptService.load('pdfMake', 'vfsFonts');
  }

  generatePdf(alumno: IAlumno, calificacionesPorAlumno: any[], action = 'open') {
    this.calificacionesPorAlumno = calificacionesPorAlumno;
    this.alumno = alumno;
    const documentDefinition = this.getDocumentDefinition();
    switch (action) {
      case 'open':
        pdfMake.createPdf(documentDefinition).open();
        break;
      case 'print':
        pdfMake.createPdf(documentDefinition).print();
        break;
      case 'download':
        pdfMake.createPdf(documentDefinition).download();
        break;
      default:
        pdfMake.createPdf(documentDefinition).open();
        break;
    }
  }
  getDocumentDefinition() {
    return {
      pageMargins: [40, 40, 20, 40],
      pageOrientation: 'landscape',
      width: 1344,
      height: 'auto',
      content: [
        {
          text: 'Promedio de califaciones de taller por ciclo',
          bold: true,
          fontSize: 12,
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
        {
          columns: [
            {
              // auto-sized columns have their widths based on their content
              text: 'Alumno: ' + this.alumno.nombreCompleto,
              bold: true,
              fontSize: 12,
              alignment: 'left',
              width: '100%',
            },
          ],
        },

        {
          table: {
            widths: ['25%', '25%', '25%', '25%'],
            body: [...this.bodyCalificaciones()],
          },
        },
      ],
      styles: {
        tabla_cursadas: {
          margin: [0, 20, 0, 0],
        },
        tableExample: {},
      },
    };
  }
  bodyCalificaciones() {
    const total = [];
    const subtotal = [];

    this.calificacionesPorAlumno.forEach((x) => {
      const primeraLinea = [
        {
          text: 'Ciclo: ' + x.ciclo,
          bold: true,
          fontSize: 9,
          colSpan: 1,
          fillColor: '#d9d6d6',
        },

        {
          text: `  ${x.curso[0].curso}° AÑO`,
          bold: true,
          fontSize: 9,
          colSpan: 1,
          fillColor: '#d9d6d6',
        },
        {
          text: `   ${x.curso[0].division}° DIV`,
          bold: true,
          fontSize: 9,
          colSpan: 1,
          fillColor: '#d9d6d6',
        },
        {
          text: 'Comisión:' + x.curso[0].comision,
          bold: true,
          fontSize: 9,
          colSpan: 1,
          fillColor: '#d9d6d6',
        },
      ];
      total.push(primeraLinea);

      const lineas = x.datos.map((y) => {
        const promedioFinal = (Math.ceil(Number(y.notaFinal) * 2) / 2).toFixed(2);
        return [
          {
            text: '' + y.materia.toUpperCase(),
            bold: true,
            fontSize: 9,
            colSpan: 1,
          },

          {
            // text: `  ${item.notaFinal} `,
            text: promedioFinal === '0.00' ? 'A' : 'Promedio: ' + promedioFinal, // y.notaFinal,
            bold: true,
            fontSize: 9,
            colSpan: 1,
          },
          {
            text: ` ${
              y.notaFinal < 7
                ? y.examen
                    .map((e) => {
                      const f = e.fecha ? ' (' + moment.utc(e.fecha).format('DD/MM/YYYY') + '): ' : ': ';
                      if (e.ausente) {
                        return 'EXAMEN ' + e.mes + f + ' AUSENTE ';
                      } else {
                        return 'EXAMEN ' + e.mes + ' ' + f + ' ' + e.nota;
                      }
                    })
                    .join(' - ')
                : ''
            } `,
            bold: true,
            fontSize: 9,
            colSpan: 2,
          },
          {
            // text: `  `,
            // bold: true,
            // fontSize: 9,
            // colSpan: 1,
          },
        ];
      });
      total.push(...lineas);
    });

    // for (const [key, x] of Object.entries(this.calificacionesPorAlumno)) {
    //   console.log(key, x);
    //   const primeraLinea = [
    //     {
    //       text: 'Ciclo: ' + key,
    //       bold: true,
    //       fontSize: 9,
    //       colSpan: 1,
    //       fillColor: '#d9d6d6',
    //     },

    //     {
    //       text: `  ${x[0].planillaTaller.curso.curso}° AÑO`,
    //       bold: true,
    //       fontSize: 9,
    //       colSpan: 1,
    //       fillColor: '#d9d6d6',
    //     },
    //     {
    //       text: `   ${x[0].planillaTaller.curso.division}° DIV`,
    //       bold: true,
    //       fontSize: 9,
    //       colSpan: 1,
    //       fillColor: '#d9d6d6',
    //     },
    //     {
    //       text: 'Comisión:' + x[0].planillaTaller.curso.comision,
    //       bold: true,
    //       fontSize: 9,
    //       colSpan: 1,
    //       fillColor: '#d9d6d6',
    //     },
    //   ];
    //   total.push(primeraLinea);
    //   x.forEach((item) => {
    //     console.log('item', item);
    //     let lineas = [
    //       {
    //         text: item.planillaTaller.asignatura._id + ' - ' + item.planillaTaller.asignatura.detalle,
    //         bold: true,
    //         fontSize: 9,
    //         colSpan: 1,
    //       },

    //       {
    //         // text: `  ${item.notaFinal} `,
    //         text: ` NOTA: ${item.promedioGeneral}`,
    //         bold: true,
    //         fontSize: 9,
    //         colSpan: 1,
    //       },
    //       {
    //         text: ` EXAMEN `,
    //         // text: ` ${item.notaFinal < 7 ? 'EXAMEN: ' : ''} `,
    //         bold: true,
    //         fontSize: 9,
    //         colSpan: 1,
    //       },
    //       {
    //         text: `  `,
    //         // text: ` ${item.notaFinal < 7 ? 'EXAMEN: ' : ''} `,
    //         bold: true,
    //         fontSize: 9,
    //         colSpan: 1,
    //       },
    //     ];
    //     total.push(lineas);
    //   });
    // }

    return total;
  }
}
