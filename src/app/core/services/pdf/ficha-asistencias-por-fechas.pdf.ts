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

  async generatePdf(asistenciasGrupo: any[], fechaInicio: string, fechaFinal: string, action = 'open') {
    this.asistenciasGrupo = asistenciasGrupo;
    this.fechaInicio = fechaInicio;
    this.fechaFinal = fechaFinal;
    const documentDefinition = await this.getDocumentDefinition();
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
  async getDocumentDefinition() {
    return {
      pageMargins: [40, 40, 20, 40],
      //   pageOrientation: 'landscape',
      width: 1344,
      height: 'auto',
      content: [
        {
          text: `Informe de asistencia desde ${moment.utc(this.fechaInicio).format('DD/MM/YYYY')} al ${moment
            .utc(this.fechaFinal)
            .format('DD/MM/YYYY')}`,
          bold: true,
          fontSize: 12,
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
        ...(await this.bodyAsistencias()),
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
  async bodyAsistencias() {
    const tabla2 = await Promise.all(
      this.asistenciasGrupo.map(async (asistencia: any) => {
        let contadorAusentes = 0;
        let completa = false;
        //   [
        //     // Un Grupo
        //     [
        //       { alumno, planilla, fecha, presente },
        //       { alumno, planilla, fecha, presente },
        //     ],
        //     // Otro grupo
        //     [],
        //   ];
        let asis: any[] = [];
        if (await asistencia.some((x) => !x.presente && !x.ausentePermitido)) {
          completa = false;
          asis = await (
            asistencia.map((a) => {
              if (!a.presente && !a.ausentePermitido) {
                contadorAusentes++;
                return [
                  { colSpan: 1, text: a.alumno.dni, fontSize: 10 },
                  { colSpan: 1, text: a.alumno.nombreCompleto, fontSize: 10 },
                  { colSpan: 1, text: 'Ausente', fontSize: 10, alignment: 'center' },
                ];
              } else {
                return null;
              }
            }) as any[]
          ).filter((m) => m);
        } else {
          completa = true;
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
        const planilla: IPlanillaTaller = asistencia[0].planillaTaller;
        const fecha: string = moment.utc(asistencia[0].fecha).format('DD/MM/YYYY');
        const retorno = [
          {
            // stack: [
            //   {
            // =====
            table: {
              // keepWithHeaderRows: 1,
              widths: ['33%', '33%', '33%'],
              headerRows: 2,
              body: [
                // Fecha
                [
                  {
                    text: `Fecha: ${fecha}`,
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
                    style: 'tableHeader',
                    fontSize: 10,
                    colSpan: 1,
                    alignment: 'left',
                    border: [true, false, false, false],
                  },
                  {
                    text: `Curso: ${planilla.curso.curso} Div.: ${planilla.curso.division} Com:${
                      planilla.curso.comision ? planilla.curso.comision : ''
                    }`,
                    style: 'tableHeader',
                    fontSize: 10,
                    colSpan: 1,
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
                    fontSize: 10,
                    style: 'tableHeader',
                    alignment: 'left',
                    colSpan: 1,
                    bold: 'true',
                    fillColor: `${completa ? '' : '#eeeeee'}`,
                  },
                  {
                    text: `${completa ? '' : 'Nombre y Apellido'}`,
                    style: 'tableHeader',
                    colSpan: 1,
                    fontSize: 10,
                    alignment: 'left',
                    fillColor: `${completa ? '' : '#eeeeee'}`,
                    bold: 'true',
                  },
                  {
                    text: `${completa ? '' : 'Asistencia'}`,
                    fontSize: 10,
                    colSpan: 1,
                    style: 'tableHeader',
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
                //   ...asistencia.map((a) => {
                //     return [
                //       { text: a.alumno.dni, fontSize: 10 },
                //       { text: a.alumno.nombreCompleto, fontSize: 10 },
                //       { text: a.presente ? 'Presente' : 'Ausente', fontSize: 10, alignment: 'center' },
                //     ];
                //   }),
                //   [
                //     {
                //       text: `Asistencia Completa`,
                //       style: 'tableHeader',
                //       alignment: 'center',
                //       bold: 'true',
                //       fontSize: 10,
                //       fillColor: '#eeeeee',
                //       colSpan: 3,
                //     },
                //   ],
                //   ,
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
                  { text: 'FIRMA PROFESOR', fontSize: 10, border: [false, true, false, false], alignment: 'center' },
                  { text: '', border: [false, false, false, false] },
                ],
              ],
            },
          },
          // ],
          // unbreakable: true, // that's the magic :)
        ];
        return retorno;
      })
    );

    return _.chunk(tabla2, 1).map((x) => ({ stack: [x], unbreakable: true }));
  }
}
