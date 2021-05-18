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
export class FichaAsistenciasPorDiaPdf {
  asistencias: any[]; // { planillaTaller:string,grupoPlanilla:any[]}
  fechaInicio: string;
  constructor(private scriptService: ScriptService) {
    this.scriptService.load('pdfMake', 'vfsFonts');
  }

  generatePdf(asistencias: any[], fechaInicio: string, action = 'open') {
    this.asistencias = asistencias;
    this.fechaInicio = fechaInicio;
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
  getAsistenciasTablas() {
    const tabla = this.asistencias.map((x) => {
      const unaPlanillaAsistencia: any[] = x.grupoPlanilla;
      const planilla: IPlanillaTaller = unaPlanillaAsistencia[0].planillaTaller;
      let contador = 0;
      return [
        {
          // stack:
          //   {
          // =====
          table: {
            widths: ['33%', '33%', '33%'],
            headerRows: 2,
            // keepWithHeaderRows: 1,
            body: [
              // Fecha
              [
                {
                  text: `Fecha: ${moment.utc(this.fechaInicio).format('DD/MM/YYYY')}`,
                  style: 'tableHeader',
                  alignment: 'left',
                  bold: true,
                  colSpan: 3,
                  border: [true, true, true, false],
                },
                {},
                {},
              ],
              //   Asig/Curso/Prof
              [
                {
                  text: planilla.curso.comision ? 'Taller: ' + planilla.asignatura.detalle : planilla.asignatura.detalle,
                  style: 'tableHeader',
                  colSpan: 1,
                  alignment: 'left',
                  border: [true, false, false, false],
                },
                {
                  text: `Curso: ${planilla.curso.curso} Div.: ${planilla.curso.division} Com:${
                    planilla.curso.comision ? planilla.curso.comision : ''
                  }`,
                  style: 'tableHeader',
                  colSpan: 1,
                  alignment: 'center',
                  border: [false, false, false, false],
                },
                {
                  text: `Prof: ${planilla.profesor.nombreCompleto}`,
                  style: 'tableHeader',
                  alignment: 'center',
                  border: [false, false, true, false],
                },
              ],
              [
                {
                  text: `Dni`,
                  style: 'tableHeader',
                  alignment: 'left',
                  bold: 'true',
                  fillColor: '#eeeeee',
                },
                {
                  text: `Nombre y Apellido`,
                  style: 'tableHeader',
                  alignment: 'left',
                  bold: 'true',
                  fillColor: '#eeeeee',
                },
                {
                  text: `Asistencia`,
                  style: 'tableHeader',
                  alignment: 'center',
                  bold: 'true',
                  fillColor: '#eeeeee',
                },
              ],
              ...unaPlanillaAsistencia.map((asistencia) => {
                if (asistencia.presente) {
                  contador++;
                }
                return [
                  {
                    text: asistencia.alumno.dni,
                    bold: asistencia.presente ? false : true,
                  },
                  {
                    text: asistencia.alumno.nombreCompleto,
                    bold: asistencia.presente ? false : true,
                  },
                  {
                    text: asistencia.presente ? 'Presente' : 'Ausente',
                    alignment: 'center',
                    bold: asistencia.presente ? false : true,
                  },
                ];
              }),
              [
                {},
                {},
                {
                  text:
                    contador === unaPlanillaAsistencia.length
                      ? 'Asistencia Completa'
                      : 'Total Ausentes: ' + (unaPlanillaAsistencia.length - contador),
                  colSpan: 1,
                  alignment: 'center',
                  bold: 'true',
                },
              ],
            ],
          },
          layout: {
            hLineWidth: function (i, node) {
              return i === 0 || i === node.table.body.length ? 2 : 1;
            },
            vLineWidth: function (i, node) {
              return i === 0 || i === node.table.widths.length ? 1 : 0;
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
          // =====
        },
        {
          style: 'mt24',
          table: {
            widths: ['60%', '20%', '20%'],
            body: [
              [
                { text: '', border: [false, false, false, false] },
                { text: 'FIRMA PROFESOR', border: [false, true, false, false], alignment: 'center' },
                { text: '', border: [false, false, false, false] },
              ],
            ],
          },
        },
        // ],
        // unbreakable: true, // that's the magic :)
      ];
    });
    return _.chunk(tabla, 1).map((x) => ({ stack: [x], unbreakable: true }));
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
          fontSize: 14,
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },

        ...this.getAsistenciasTablas(),
      ],
      styles: {
        tabla_cursadas: {
          margin: [0, 20, 0, 0],
        },
        mt24: {
          margin: [0, 60, 0, 0],
        },
        tableExample: {},
      },
    };
  }
  bodyAsistencias() {}
}
