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
export class FichaAsistenciasPorFechasPdf {
  //   asistenciasGrupo =[
  //     // Un Grupo
  //     [
  //       { alumno1, planilla1, fecha1, presente },
  //       { alumno2, planilla1, fecha1, presente },
  //     ],
  //     // Otro grupo
  //     [
  //        { alumno1, planilla1, fecha2, presente },
  //        { alumno2, planilla1, fecha2, presente },
  //        { alumno3, planilla1, fecha2, presente },
  //     ],
  //   ];
  asistenciasGrupo: any[]; //

  fechaInicio: string;
  fechaFinal: string;
  constructor(private scriptService: ScriptService) {
    this.scriptService.load('pdfMake', 'vfsFonts');
  }

  generatePdf(asistenciasGrupo: any[], fechaInicio: string, fechaFinal: string, action = 'open') {
    this.asistenciasGrupo = asistenciasGrupo;
    this.fechaInicio = fechaInicio;
    this.fechaFinal = fechaFinal;
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
          text: `Informe de asistencia desde ${moment.utc(this.fechaInicio).format('DD/MM/YYYY')} al ${moment
            .utc(this.fechaFinal)
            .format('DD/MM/YYYY')}`,
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
        ...this.bodyAsistencias(),
      ],
      styles: {
        tabla_cursadas: {
          margin: [0, 20, 0, 0],
        },
        margin_firma: {
          margin: [0, 40, 0, 20],
        },
        tableExample: {},
      },
    };
  }
  bodyAsistencias() {
    const tabla = this.asistenciasGrupo.map((asistencia) => {
      //   [
      //     // Un Grupo
      //     [
      //       { alumno, planilla, fecha, presente },
      //       { alumno, planilla, fecha, presente },
      //     ],
      //     // Otro grupo
      //     [],
      //   ];

      const planilla: IPlanillaTaller = asistencia[0].planillaTaller;
      const fecha: string = moment.utc(asistencia[0].fecha).format('DD/MM/YYYY');
      return [
        {
          // stack: [
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
                  text: `Fecha: ${fecha}`,
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
                },
                {
                  text: `Nombre y Apellido`,
                  style: 'tableHeader',
                  alignment: 'left',
                  bold: 'true',
                },
                {
                  text: `Asistencia`,
                  style: 'tableHeader',
                  alignment: 'center',
                  bold: 'true',
                },
              ],
              ...asistencia.map((a) => {
                return [a.alumno.dni, a.alumno.nombreCompleto, { text: a.presente ? 'Presente' : 'Ausente', alignment: 'center' }];
              }),
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
          style: 'margin_firma',
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
}
