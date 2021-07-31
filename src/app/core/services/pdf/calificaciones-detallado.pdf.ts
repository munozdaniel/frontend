import { Injectable } from '@angular/core';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ScriptService } from '../plugins/script-excel.service';
declare let pdfMake: any;
@Injectable({
  providedIn: 'root',
})
export class CalificacionesDetalladoPdf {
  calificacionesPorAlumno: any[];
  calendario: any[];
  planilla: IPlanillaTaller;
  constructor(private scriptService: ScriptService) {
    this.scriptService.load('pdfMake', 'vfsFonts');
  }

  generatePdf(planilla: IPlanillaTaller, calificacionesPorAlumno: any[], action = 'open') {
    this.calificacionesPorAlumno = calificacionesPorAlumno;
    let fechaInicio = moment(planilla.fechaInicio, 'YYYY-MM-DD').utc();
    let fechaFinal = moment(planilla.fechaFinalizacion, 'YYYY-MM-DD').utc();
    const calendarioMaterias = [];
    while (fechaFinal.utc().isSameOrAfter(fechaInicio)) {
      calendarioMaterias.push({
        planillaTaller: planilla,
        fecha: fechaInicio,
        activo: true,
      });
      fechaInicio = moment(fechaInicio).utc().add(1, 'day');
    }
    this.calendario = calendarioMaterias;
    this.planilla = planilla;
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
    const now = new Date();
    const hoy: string = moment(now).format('YYYY');

    return {
      pageMargins: [40, 40, 20, 40],
      //   pageOrientation: 'landscape',
      width: 1344,
      height: 'auto',
      content: [
        {
          text: 'Registro de Notas ' + hoy,
          bold: true,
          fontSize: 12,
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
        {
          columns: [
            {
              // auto-sized columns have their widths based on their content
              text: this.planilla.asignatura.detalle,
              bold: true,
              fontSize: 10,
              width: '20%',
            },
            {
              // auto-sized columns have their widths based on their content
              text: ` ${this.planilla.curso.curso}° AÑO ${this.planilla.curso.division}° DIV. COM. ${this.planilla.curso.comision} `,
              bold: true,
              fontSize: 10,
              width: '20%',
            },
            {
              // star-sized columns fill the remaining space
              // if there's more than one star-column, available width is divided equally
              text: this.planilla.bimestre,
              width: '20%',
              bold: true,
              fontSize: 10,
            },
            {
              // star-sized columns fill the remaining space
              // if there's more than one star-column, available width is divided equally
              text: `Turno  ${this.planilla.turno}`,
              width: '20%',
              bold: true,
              fontSize: 10,
            },
            {
              // star-sized columns fill the remaining space
              // if there's more than one star-column, available width is divided equally
              text: 'Prof. ' + this.planilla.profesor.nombreCompleto,
              width: '20%',
              bold: true,
              fontSize: 10,
            },
          ],
        },

        {
          table: {
            widths: ['40%', '40%', '10%', '10%'],
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
    const primeraLinea = [
      {
        text: 'Alumno',
        bold: true,
        fontSize: 10,
        colSpan: 1,
        fillColor: '#d9d6d6',
      },
      {
        text: 'Notas',
        bold: true,
        fontSize: 10,
        colSpan: 1,
        fillColor: '#d9d6d6',
      },
      {
        text: 'Prom.',
        bold: true,
        fontSize: 10,
        colSpan: 1,
        fillColor: '#d9d6d6',
      },
      {
        text: 'P.Final',
        bold: true,
        fontSize: 10,
        colSpan: 1,
        fillColor: '#d9d6d6',
      },
    ];
    total.push(primeraLinea);
    this.calificacionesPorAlumno.forEach((x, indexPpal) => {
      let suma = 0;
      let totalPromedios = 0;
      let totalCalificaciones = 0;
      const notas = x.calificaciones
        .map((a) => {
          let retorno = '';
          if (a) {
            if (a.promedioGeneral) {
              totalCalificaciones++;
            }
            retorno += a.promedioGeneral ? ' ' + a.promedioGeneral + ' ' : ' A ';
            if (a.promedia) {
              totalPromedios += 1;
            }
            suma += a.promedioGeneral ? Number(a.promedioGeneral) : 0;
            return retorno;
          }
        })
        .join(' ');
      const promedio = suma ? (suma / totalCalificaciones).toFixed(2) : Number(0).toFixed(2);
      const promedioFinal = (Math.ceil(Number(promedio) * 2) / 2).toFixed(2);
      let lineaAlumno = [
        {
          text: x.alumnoNombre,
          bold: false,
          fontSize: 10,
          //   fillColor: indexPpal % 2 === 0 ? '' : '#d9d6d6',
        },
        {
          text: notas,
          bold: false,
          fontSize: 10,
          //   fillColor: indexPpal % 2 === 0 ? '' : '#d9d6d6',
        },
        {
          text: promedio,
          bold: false,
          fontSize: 10,
          //   fillColor: indexPpal % 2 === 0 ? '' : '#d9d6d6',
        },
        {
          text: promedioFinal,
          bold: false,
          fontSize: 10,
          //   fillColor: indexPpal % 2 === 0 ? '' : '#d9d6d6',
        },
      ];
      total.push(lineaAlumno);
      //   total.push(...lineaAlumno);

      //   total.push(subtotal);
      //   const promedio = suma ? (suma / totalCalificaciones).toFixed(2) : Number(0).toFixed(2);
      //   const promedioFinal = (Math.ceil(Number(promedio) * 2) / 2).toFixed(2);
      //   total.push([
      //     { text: '', colSpan: 2 },
      //     {},
      //     {
      //       columns: [
      //         {
      //           // auto-sized columns have their widths based on their content
      //           width: 'auto',
      //           text: 'Promedio',
      //           alignment: 'left',
      //           bold: true,
      //         },
      //         {
      //           // star-sized columns fill the remaining space
      //           // if there's more than one star-column, available width is divided equally
      //           width: '*',
      //           text: promedio ? promedio : 0,
      //           alignment: 'right',
      //           bold: true,
      //         },
      //       ],
      //     },
      //     {
      //       columns: [
      //         {
      //           // auto-sized columns have their widths based on their content
      //           width: 'auto',
      //           text: 'Promedio Final',
      //           alignment: 'left',
      //           bold: true,
      //         },
      //         {
      //           // star-sized columns fill the remaining space
      //           // if there's more than one star-column, available width is divided equally
      //           width: '*',
      //           text: promedioFinal,
      //           alignment: 'right',
      //           bold: true,
      //         },
      //       ],
      //     },
      //     {},

      //     // { text: x.totalAusentes, bold: true, fontSize: 12, fillColor: '#d9d6d6', colSpan: 1, alignment: 'left' },
      //   ]);
      //   total.push([{ text: '', colSpan: 5 }, {}, {}, {}, {}]);
    });
    return total;
  }
}
