import { Injectable } from '@angular/core';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ScriptService } from '../plugins/script-excel.service';
declare let pdfMake: any;
@Injectable({
  providedIn: 'root',
})
export class AlumnosPorTallerPdf {
  reporteAlumnos: any[];
  calendario: any[];
  planilla: IPlanillaTaller;
  constructor(private scriptService: ScriptService) {
    this.scriptService.load('pdfMake', 'vfsFonts');
  }

  generatePdf(planilla: IPlanillaTaller, reporteAlumnos: any[], action = 'open') {
    this.reporteAlumnos = reporteAlumnos;
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
          text: 'Informe de alumnos por taller',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
        ...this.body(),
      ],
      styles: {
        tabla_cursadas: {
          margin: [0, 20, 0, 0],
        },
        tableExample: {},
      },
    };
  }
  cabecera(alumno) {
    return [
      {
        text: alumno.legajo,
        bold: false,
        fontSize: 12,
        colSpan: 1,
      },
      {
        text: alumno.alumnoNombre,
        bold: false,
        fontSize: 12,
        colSpan: 1,
      },
      {
        text: `Curso: ${this.planilla.curso.curso} - Div.: ${this.planilla.curso.division} - Com.: ${this.planilla.curso.comision}`,
        bold: false,
        fontSize: 12,
        colSpan: 1,
      },
    ];
  }
  calificaciones(alumno) {
    return [
      {
        row: [
          {
            text: 'Cal. Parciales',
            bold: true,
            fontSize: 16,
            alignment: 'left',
            width: '100%',
          },
          {
            // star-sized columns fill the remaining space
            // if there's more than one star-column, available width is divided equally
            text: 'Prom Final',
            width: '50%',
            bold: true,
            fontSize: 16,
            alignment: 'right',
          },
        ],
      },
    ];
  }
  body() {
    const total = [];
    const subtotal = [];
    this.reporteAlumnos.forEach((x) => {
      //   ================================
      const tablaCabecera = {
        table: {
          widths: ['20%', '40%', '40%'],
          body: [this.cabecera(x)],
        },
      };
      total.push(tablaCabecera);
      //   ================================
      //   const tablaCalificaciones = {
      //     table: {
      //       widths: ['20%', '80%'],
      //       body: this.calificaciones(x),
      //     },
      //   };
      //   total.push([{ text: '', colSpan: 5 }, {}, {}, {}, {}]);
    });
    console.log('total', total);
    return [...total];
  }
}
