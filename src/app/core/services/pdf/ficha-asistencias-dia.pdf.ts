import { Injectable } from '@angular/core';
import { IAdulto } from 'app/models/interface/iAdulto';
import { IAsistencia } from 'app/models/interface/iAsistencia';
import { ICalendario } from 'app/models/interface/iCalendario';
import { IEstadoCursada } from 'app/models/interface/iEstadoCursada';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ScriptService } from '../plugins/script-excel.service';
declare let pdfMake: any;
@Injectable({
  providedIn: 'root',
})
export class FichaAsistenciaDiaPdf {
  asistenciasPorAlumno: any[];
  calendario: any[];
  planilla: IPlanillaTaller;
  constructor(private scriptService: ScriptService) {
    this.scriptService.load('pdfMake', 'vfsFonts');
  }

  generatePdf(planilla: IPlanillaTaller, asistenciasPorAlumno: any[], action = 'open') {
    this.asistenciasPorAlumno = asistenciasPorAlumno;
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
          text: 'Planilla de asistencia por día',
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
              width: '50%',
            },
            {
              // star-sized columns fill the remaining space
              // if there's more than one star-column, available width is divided equally
              text: 'Prof. ' + this.planilla.profesor.nombreCompleto,
              width: '50%',
              bold: true,
              fontSize: 16,
              alignment: 'right',
            },
          ],
        },

        {
          table: {
            widths: ['20%', '40%', '20%', '20%'],
            body: [...this.bodyAsistencias()],
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
  bodyAsistencias() {
    const total = [];
    this.asistenciasPorAlumno.forEach((x) => {
      x.asistenciasArray.forEach((a) => {
        const primeraLinea = [
          {
            text: 'Fecha: ' + a.fecha,
            bold: true,
            fontSize: 12,
            colSpan: 2,
            fillColor: '#d9d6d6',
          },
          {},
          {
            text: 'Asistencia',
            bold: true,
            fontSize: 12,
            colSpan: 1,
            fillColor: '#d9d6d6',
          },
          {
            text: 'Llegó Tarde',
            bold: true,
            fontSize: 12,
            colSpan: 1,
            fillColor: '#d9d6d6',
          },
        ];

        const segundaLinea = [
          {
            text: x.legajo,
            bold: false,
            fontSize: 12,
            colSpan: 1,
          },
          {
            text: x.alumnoNombre,
            bold: false,
            fontSize: 12,
            colSpan: 1,
          },
          {
            text: a.presente ? 'SI' : 'NO',
            bold: false,
            fontSize: 12,
            colSpan: 1,
          },
          {
            text: a.tarde ? 'SI' : 'NO',
            bold: false,
            fontSize: 12,
            colSpan: 1,
          },
        ];
        total.push(primeraLinea);
        total.push(segundaLinea);
      });
      //
      total.push([
        {
          text: 'Total Asistencia:' + x.totalAsistencias,
          bold: true,
          fontSize: 12,
          colSpan: 2,
          fillColor: '#d9d6d6',
        },
        // { text: x.totalAsistencias, bold: true, fontSize: 12, colSpan: 1, fillColor: '#d9d6d6', alignment: 'left' },
        {
          text: 'Total Ausentes:' + x.totalAusentes,
          bold: true,
          fontSize: 12,
          fillColor: '#d9d6d6',
          colSpan: 2,
        },
        {},
        {},
        // { text: x.totalAusentes, bold: true, fontSize: 12, fillColor: '#d9d6d6', colSpan: 1, alignment: 'left' },
      ]);
      total.push([{}, {}, {}, {}]);
      //
    });
    console.log('toal', total);
    return total;
  }
}
