import { Injectable } from '@angular/core';
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
      let contadorAusentes = 0;
      let asis: any = unaPlanillaAsistencia
        .map((asistencia) => {
          if (!asistencia.presente) {
            contadorAusentes++;
            return [
              {
                text: asistencia.alumno.dni,
                fontSize: 10,
                bold:  true,
              },
              {
                fontSize: 10,
                text: asistencia.alumno.nombreCompleto,
                bold:  true,
              },
              {
                text: 'Ausente',
                fontSize: 10,
                alignment: 'center',
                bold:  true,
              },
            ];
          } else {
            contador++;
            return null;
          }
        })
        .filter((m) => m);
      const completa = contador === unaPlanillaAsistencia.length;
      console.log('completa', completa);
      if (completa) {
        asis = [
          [
            {
              text: `Asistencia Completa`,
              style: 'tableHeader',
              alignment: 'center',
              bold: 'true',
              fontSize: 10,
              fillColor: '#eeeeee',
              colSpan: 3,
            },
            {},
            {},
          ],
        ];
      }
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
                  fontSize: 10,
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
                  fontSize: 10,
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
                  fontSize: 10,
                  alignment: 'center',
                  border: [false, false, false, false],
                },
                {
                  text: `Prof: ${planilla.profesor.nombreCompleto}`,
                  fontSize: 10,
                  style: 'tableHeader',
                  alignment: 'center',
                  border: [false, false, true, false],
                },
              ],
              [
                {
                  text: `${completa ? '' : 'Dni'}`,
                  style: 'tableHeader',
                  alignment: 'left',
                  bold: 'true',
                  fontSize: 10,
                  fillColor: `${completa ? '' : '#eeeeee'}`,
                },
                {
                  text: `${completa ? '' : 'Nombre y Apellido'}`,
                  style: 'tableHeader',
                  fontSize: 10,
                  alignment: 'left',
                  bold: 'true',
                  fillColor: `${completa ? '' : '#eeeeee'}`,
                },
                {
                  text: `${completa ? '' : 'Asistencia'}`,
                  style: 'tableHeader',
                  fontSize: 10,
                  alignment: 'center',
                  bold: 'true',
                  fillColor: `${completa ? '' : '#eeeeee'}`,
                },
              ],
              ...asis,
              [
                {},
                {},
                {
                  fontSize: 10,
                  text: completa ? '' : 'Total Ausentes: ' + contadorAusentes,
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
                { text: 'FIRMA PROFESOR', fontSize: 10, border: [false, true, false, false], alignment: 'center' },
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
      //   pageOrientation: 'landscape',
      width: 1344,
      height: 'auto',
      content: [
        {
          text: 'Informe de asistencia por día',
          bold: true,
          fontSize: 12,
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
