import { Injectable } from '@angular/core';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ScriptService } from '../plugins/script-excel.service';
declare let pdfMake: any;
@Injectable({
  providedIn: 'root',
})
export class CalificacionesResumidoPdf {
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
    return {
      pageMargins: [40, 40, 20, 40],
      pageOrientation: 'landscape',
      width: 1344,
      height: 'auto',
      content: [
        {
          text: 'Informe de calificaciones por taller',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
        {
          columns: [
            {
              // auto-sized columns have their widths based on their content
              text: this.planilla.asignatura.detalle,
              bold: true,
              fontSize: 16,
              alignment: 'left',
              width: '33%',
            },
            {
              // star-sized columns fill the remaining space
              // if there's more than one star-column, available width is divided equally
              text: 'Prof. ' + this.planilla.profesor.nombreCompleto,
              width: '33%',
              bold: true,
              fontSize: 16,
              alignment: 'center',
            },
            {
              // star-sized columns fill the remaining space
              // if there's more than one star-column, available width is divided equally
              text: this.planilla.bimestre,
              width: '33%',
              bold: true,
              fontSize: 16,
              alignment: 'right',
            },
          ],
        },

        {
          table: {
            widths: ['10%', '36%', '18%', '18%', '18%'],
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
      let suma = 0;
      let totalPromedios = 0;
      let totalCalificaciones = x.calificaciones.length;
      const primeraLinea = [
        {
          text: 'Legajo',
          bold: true,
          fontSize: 12,
          colSpan: 1,
          fillColor: '#d9d6d6',
        },
        {
          text: 'Nombre Completo',
          bold: true,
          fontSize: 12,
          colSpan: 1,
          fillColor: '#d9d6d6',
        },
        {
          text: ' Curso:' + this.planilla.curso.curso,
          bold: true,
          fontSize: 12,
          colSpan: 1,
          fillColor: '#d9d6d6',
        },
        {
          text: 'Div.:' + this.planilla.curso.division,
          bold: true,
          fontSize: 12,
          colSpan: 1,
          fillColor: '#d9d6d6',
        },
        {
          text: 'Comisión:' + this.planilla.curso.comision,
          bold: true,
          fontSize: 12,
          colSpan: 1,
          fillColor: '#d9d6d6',
        },
      ];
      let terceraLinea = [];
      let notas = '';
      x.calificaciones.forEach((a, index: number) => {
        if (a.promedia) {
          notas += '  ' + Number(a.promedioGeneral).toFixed(2) + '  ';
          if (a.promedia) {
            totalPromedios += 1;
          }
          suma += a.promedioGeneral;
        }
        // subtotal.push(terceraLinea);
      });

      const t = terceraLinea.length > 0 ? terceraLinea : [];
      const segundaLinea = [
        {
          text: x.legajo,
          bold: true,
          fontSize: 12,
          colSpan: 1,
        },
        {
          text: x.alumnoNombre,
          bold: true,
          fontSize: 12,
          colSpan: 1,
        },
        {
          //   text:  x.calificaciones.map((x) => x.promedioGeneral).join(' - '),
          text: notas,
          bold: true,
          fontSize: 12,
          colSpan: 3,
        },
        {},
        {},
      ];

      //
      total.push(primeraLinea);
      total.push(segundaLinea);
      //   total.push(subtotal);
      const promedio = suma ? (suma / totalCalificaciones).toFixed(2) : Number(0).toFixed(2);
      const promedioFinal = (Math.ceil(Number(promedio) * 2) / 2).toFixed(2);
      total.push([
        { text: '', colSpan: 2 },
        {},
        {
          columns: [
            {
              // auto-sized columns have their widths based on their content
              width: 'auto',
              text: 'Promedio',
              alignment: 'left',
              bold: true,
            },
            {
              // star-sized columns fill the remaining space
              // if there's more than one star-column, available width is divided equally
              width: '*',
              text: promedio ? promedio : 0,
              alignment: 'right',
              bold: true,
            },
          ],
        },
        {
          columns: [
            {
              // auto-sized columns have their widths based on their content
              width: 'auto',
              text: 'Promedio Final',
              alignment: 'left',
              bold: true,
            },
            {
              // star-sized columns fill the remaining space
              // if there's more than one star-column, available width is divided equally
              width: '*',
              text: promedioFinal,
              alignment: 'right',
              bold: true,
            },
          ],
        },
        {},

        // { text: x.totalAusentes, bold: true, fontSize: 12, fillColor: '#d9d6d6', colSpan: 1, alignment: 'left' },
      ]);
      total.push([{ text: '', colSpan: 5 }, {}, {}, {}, {}]);
    });
    return total;
  }
}
