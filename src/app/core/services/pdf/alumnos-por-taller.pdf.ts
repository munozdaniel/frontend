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
      //   pageMargins: [40, 40, 20, 40],
      //   width: 1344,
      //   height: 'auto',
      pageSize: 'A4',
      content: [
        // {
        //   text: 'Informe de alumnos por taller',
        //   bold: true,
        //   fontSize: 20,
        //   alignment: 'center',
        //   margin: [0, 0, 0, 20],
        // },
        ...this.body(),
      ],
      styles: {
        ultima: {
          margin: [0, 0, 0, 10],
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
        fillColor: '#d9d6d6',
      },
      {
        text: alumno.alumnoNombre,
        bold: false,
        fontSize: 12,
        colSpan: 1,
        fillColor: '#d9d6d6',
      },
      {
        text: `Curso: ${this.planilla.curso.curso} - Div.: ${this.planilla.curso.division} - Com.: ${this.planilla.curso.comision}`,
        bold: false,
        fontSize: 12,
        colSpan: 1,
        fillColor: '#d9d6d6',
      },
    ];
  }
  calificaciones(alumno) {
    let notas = '';
    let suma = 0;
    let totalPromedios = 0;
    let totalCalificaciones = alumno.calificaciones.length;
    alumno.calificaciones.forEach((a, index: number) => {
      if (a) {
        notas += '  ' + Number(a.promedioGeneral).toFixed(2) + '  ';
        if (a.promedia) {
          totalPromedios += 1;
        }
        suma += a.promedioGeneral;
      }
      // subtotal.push(terceraLinea);
    });
    const total = [];
    const promedio = suma ? (suma / totalCalificaciones).toFixed(2) : Number(0).toFixed(2);
    const promedioFinal = promedio !== '0.00' ? (Math.ceil(Number(promedio) * 2) / 2).toFixed(2) : Number(0).toFixed(2);
    total.push(
      [
        {
          table: {
            body: [
              [
                {
                  text: 'Calificaciones',
                  bold: true,
                  fontSize: 12,
                  alignment: 'right',
                  width: '100%',
                },
              ],
              [
                {
                  // star-sized columns fill the remaining space
                  // if there's more than one star-column, available width is divided equally
                  text: 'Promedio Final',
                  bold: true,
                  fontSize: 12,
                  alignment: 'right',
                  width: '100%',
                },
              ],
            ],
          },
          layout: {
            defaultBorder: false,
          },
        },
      ],
      [
        {
          layout: {
            defaultBorder: false,
          },
          table: {
            widths: ['100%'],
            body: [
              [
                {
                  text: notas,
                },
              ],
              [
                {
                  text: promedioFinal,
                },
              ],
            ],
          },
        },
      ]
    );
    return total;
  }
  asistencias(alumno) {
    const total = [];
    total.push([
      {
        table: {
          body: [
            [
              {
                text: 'Inasistencias',
                bold: true,
                fontSize: 12,
                alignment: 'right',
                width: '100%',
              },
            ],
          ],
        },
        layout: {
          defaultBorder: false,
        },
      },
    ]);

    total.push({
      layout: {
        defaultBorder: false,
      },
      table: {
        widths: ['20%', '28%', '18%', '32%'],
        body: [
          [
            {
              colSpan: 4,
              layout: {
                defaultBorder: false,
              },
              table: {
                body: [alumno.inasistencias.map((x) => ({ text: x ? x.fecha : '', fontSize: 12 }))],
              },
            },
            {},
            {},
            {},
          ],
          [
            { text: 'Clases: ' + alumno.totalClases, fontSize: 12 },
            { text: 'Asistencia: ' + alumno.porcentajeAsistencias + ' %', fontSize: 12 },
            { text: 'Tarde: ' + alumno.llegadasTardes, fontSize: 12 },
            { text: 'Inasistencia: ' + alumno.porcentajeInasistencias + ' %', fontSize: 12 },
          ],
        ],
      },
    });

    return total;
  }
  taller(alumno) {
    const total = [];
    total.push([
      {
        table: {
          body: [
            [
              {
                text: 'Taller',
                bold: true,
                fontSize: 12,
                alignment: 'right',
                width: '100%',
              },
            ],
            [
              {
                text: 'Profesor',
                bold: true,
                fontSize: 12,
                alignment: 'right',
                width: '100%',
              },
            ],
          ],
        },
        layout: {
          defaultBorder: false,
        },
      },
    ]);

    total.push({
      layout: {
        defaultBorder: false,
      },
      table: {
        widths: ['50%', '50%'],
        body: [
          [
            {
              colSpan: 2,
              text: this.planilla.asignatura.detalle,
            },
            {},
          ],
          [
            {
              colSpan: 1,
              text: this.planilla.profesor.nombreCompleto,
            },
            {
              colSpan: 1,
              text: 'Firma',
              alignment: 'center',
              fontSize: 9,
              border: [false, true, false, false],
            },
          ],
        ],
      },
    });

    return total;
  }
  body() {
    const total = [];
    const subtotal = [];
    this.reporteAlumnos.forEach((x) => {
      //   ================================
      const tablaCabecera = {
        table: {
          heights: [35],
          widths: ['20.5%', '44%', '*'],
          body: [this.cabecera(x)],
        },
        layout: {
          hLineWidth: function (i, node) {
            return i === 0 || i === node.table.body.length ? 2 : 1;
          },
          vLineWidth: function (i, node) {
            return i === 0 || i === node.table.widths.length ? 2 : 1;
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
      total.push(tablaCabecera);
      //   ================================
      const tablaCalificaciones = {
        table: {
          widths: ['20%', '80%'],
          body: [this.calificaciones(x)],
        },
      };
      total.push(tablaCalificaciones);

      const tablaAsistencias = {
        table: {
          widths: ['20%', '80%'],
          body: [this.asistencias(x)],
        },
      };
      total.push(tablaAsistencias);

      const tablaTaller = {
        style: 'ultima',
        table: {
          widths: ['20%', '80%'],
          body: [this.taller(x)],
        },
      };
      total.push(tablaTaller);
    });
    console.log('total', total);
    return [...total];
  }
}
