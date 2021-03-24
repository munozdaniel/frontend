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
    console.log('promedio', promedio);
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
          //   text:  x.calificaciones.map((x) => x.promedioGeneral).join(' - '),
          text: notas,
          bold: true,
          fontSize: 14,
        },
        {
          //   text:  x.calificaciones.map((x) => x.promedioGeneral).join(' - '),
          text: promedioFinal,
          bold: true,
          fontSize: 14,
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
    if (alumno.inasistencias.length > 0) {
      console.log('alumno.inasistencias.length', ...alumno.inasistencias.map((x) => ({ fecha: x.fecha })));
    }
    total.push({
      table: {
        widths: ['25%', '25%', '25%', '25%'],
        body: [
          [
            {
              colSpan: 4,
              table: {
                body: [alumno.inasistencias.map((x) => ({ text: x ? x.fecha : '' }))],
              },
            },
            {},
            {},
            {},
          ],
          [
            'Total de Clases:' + alumno.totalClases,
            '(%) Asistencia:' + alumno.porcentajeAsistencias,
            'Llegadas Tarde:' + alumno.llegadasTardes,
            '(%) Inasistencia:' + alumno.porcentajeInasistencias,
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
          widths: ['20%', '40%', '40%'],
          body: [this.cabecera(x)],
        },
      };
      total.push(tablaCabecera);
      //   ================================
      const tablaCalificaciones = {
        table: {
          widths: ['20%', '80%'],
          body: [this.calificaciones(x)],
        },
        layout: {
          hLineWidth: function (i, node) {
            return i === 0 || i === node.table.body.length ? 2 : 0;
          },
          vLineWidth: function (i, node) {
            return i === 0 || i === node.table.widths.length ? 2 : 0;
          },
          hLineColor: function (i, node) {
            return i === 0 || i === node.table.body.length ? 'black' : 'white';
          },
          vLineColor: function (i, node) {
            return i === 0 || i === node.table.widths.length ? 'black' : 'white';
          },
        },
      };
      total.push(tablaCalificaciones);

      const tablaAsistencias = {
        table: {
          widths: ['20%', '80%'],
          body: [this.asistencias(x)],
        },
        layout: {
          hLineWidth: function (i, node) {
            return i === 0 || i === node.table.body.length ? 2 : 0;
          },
          vLineWidth: function (i, node) {
            return i === 0 || i === node.table.widths.length ? 2 : 0;
          },
          hLineColor: function (i, node) {
            return i === 0 || i === node.table.body.length ? 'black' : 'white';
          },
          vLineColor: function (i, node) {
            return i === 0 || i === node.table.widths.length ? 'black' : 'white';
          },
        },
      };
      total.push(tablaAsistencias);
    });
    console.log('total', total);
    return [...total];
  }
}
