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
export class FichaAsistenciaGeneralPdf {
  asistenciasPorAlumno: any[];
  calendario: any[];
  planilla: IPlanillaTaller;
  constructor(private scriptService: ScriptService) {
    this.scriptService.load('pdfMake', 'vfsFonts');
  }

  generatePdf(planilla: IPlanillaTaller, asistenciasPorAlumno: any[], action = 'open') {
    this.asistenciasPorAlumno = asistenciasPorAlumno;
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
          text: 'Planilla de Asistencia',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
        this.tablaAsistencias(),
      ],
      styles: {
        tabla_cursadas: {
          margin: [0, 20, 0, 0],
        },
        tableExample: {},
      },
    };
  }
  asistencias(alumno: any) {
    const a = alumno.asistenciasArray.map((x) => [
      {
        width: 15,
        text: x.fecha ? x.fecha : '',
        bold: true,
        fontSize: 9,
      },
      {
        width: 15,
        text: x.presente ? x.presente : '',
        bold: false,
        fontSize: 9,
        alignment: 'center',
      },
    ]);
    const r = _.chunk(a, 4);
    return r;
  }
  tablaAsistencias() {
    //

    const asis = this.asistenciasPorAlumno.map((alumno) => {
      const fila = [
        {
          text: alumno.alumnoNombre,
          bold: true,
          fontSize: 9,
        },
        {
          table: { body: [this.asistencias(alumno)] },
          layout: {
            // fillColor: function (rowIndex, node, columnIndex) {
            //   return rowIndex % 2 === 0 ? '#CCCCCC' : null;
            // },
            hLineWidth: function (i, node) {
              return i === 0 || i === node.table.body.length ? 0 : 1;
            },
            vLineWidth: function (i, node) {
              return i === 0 || i === node.table.widths.length ? 0 : 1;
            },
            hLineColor: function (i, node) {
              return 'black';
            },
            vLineColor: function (i, node) {
              return 'black';
            },
            hLineStyle: function (i, node) {
              if (i === 0 || i === node.table.body.length) {
                return null;
              }
              return { dash: { length: 10, space: 4 } };
            },
            vLineStyle: function (i, node) {
              if (i === 0 || i === node.table.widths.length) {
                return null;
              }
              return { dash: { length: 4 } };
            },
          },
        },
      ];
      return fila;
    });
    return {
      style: 'tabla1',
      table: {
        widths: ['20%', '80%'],
        body: [
          ...asis,
          //   [
          //     {
          //       text: 'Alumnos',
          //       bold: true,
          //       fontSize: 9,
          //     },
          //     ...this.calendario.map((x) => ({ text: moment.utc(x.fecha).format('DD/MM/YYYY'), fontSize: 9, bold: false })),
          //   ],
          //   ...this.contenido(),
        ],
      },
    };
  }
}
