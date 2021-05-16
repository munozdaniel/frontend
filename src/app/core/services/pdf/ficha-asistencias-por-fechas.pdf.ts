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
export class FichaAsistenciasPorFechaPdf {
  asistencias: any[]; // { alumnos,planilla}
  constructor(private scriptService: ScriptService) {
    this.scriptService.load('pdfMake', 'vfsFonts');
  }

  generatePdf(asistencias: any[], fechaInicio: string, fechaFinal?: string, action = 'open') {
    this.asistencias = asistencias;
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
          text: 'Informe de asistencia por día',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },

        ...this.asistencias.map((x) => {
          return {
            table: {
              widths: ['33%', '33%', '33%'],
              headerRows: 2,
              // keepWithHeaderRows: 1,
              body: [
                //   Asig/Curso/Prof
                [
                  {
                    text: x.planillaTaller.curso.comision
                      ? 'Taller: ' + x.planillaTaller.asignatura.detalle
                      : x.planillaTaller.asignatura.detalle,
                    style: 'tableHeader',
                    colSpan: 1,
                    alignment: 'left',
                  },
                  {
                    text: `Curso: ${x.planillaTaller.curso.curso} Div.: ${x.planillaTaller.curso.division} Com:${
                      x.planillaTaller.curso.comision ? x.planillaTaller.curso.comision : ''
                    }`,
                    style: 'tableHeader',
                    colSpan: 1,
                    alignment: 'center',
                  },
                  { text: `Prof: ${x.planillaTaller.profesor.nombreCompleto}`, style: 'tableHeader', alignment: 'center' },
                ],
                // Fecha
                [
                  { text: `Fecha: ${moment.utc(x.fecha).format('DD/MM/YYYY')}`, style: 'tableHeader', alignment: 'left', bold: true },
                  {},
                  {},
                ],
                //
                ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                [
                  { rowSpan: 3, text: 'rowSpan set to 3\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor' },
                  'Sample value 2',
                  'Sample value 3',
                ],
                ['', 'Sample value 2', 'Sample value 3'],
                ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                ['Sample value 1', { colSpan: 2, rowSpan: 2, text: 'Both:\nrowSpan and colSpan\ncan be defined at the same time' }, ''],
                ['Sample value 1', '', ''],
              ],
            },
            layout: {
              hLineWidth: function (i, node) {
                return i === 0 || i === node.table.body.length ? 2 : 1;
              },
              vLineWidth: function (i, node) {
                return i === 0 || i === node.table.widths.length ? 0 : 0;
              },
              hLineColor: function (i, node) {
                return i === 0 || i === node.table.body.length ? 'black' : 'gray';
              },
              vLineColor: function (i, node) {
                return i === 0 || i === node.table.widths.length ? 'black' : 'gray';
              },
              // hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
              // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
              // paddingLeft: function(i, node) { return 4; },
              // paddingRight: function(i, node) { return 4; },
              // paddingTop: function(i, node) { return 2; },
              // paddingBottom: function(i, node) { return 2; },
              // fillColor: function (rowIndex, node, columnIndex) { return null; }
            },
          };
        }),
      ],
      styles: {
        tabla_cursadas: {
          margin: [0, 20, 0, 0],
        },
        tableExample: {},
      },
    };
  }
  bodyAsistencias() {}
}
