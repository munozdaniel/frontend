import { Injectable } from '@angular/core';
import { DesignThemeOptionsModule } from '@design/components';
import { IAlumno } from 'app/models/interface/iAlumno';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ScriptService } from '../plugins/script-excel.service';
declare let pdfMake: any;
@Injectable({
  providedIn: 'root',
})
export class PlanillaTallerTemplatePdf {
  alumnos: IAlumno[];
  planilla: IPlanillaTaller;
  constructor(private scriptService: ScriptService) {
    this.scriptService.load('pdfMake', 'vfsFonts');
  }

  generatePdf(planillaTaller: IPlanillaTaller, alumnos: IAlumno[], action = 'open') {
    this.alumnos = alumnos;
    this.planilla = planillaTaller;
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
          text: 'Listado de Alumnos',
          bold: true,
          fontSize: 12,
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },

        {
          columns: [
            {
              text: this.planilla.curso.comision ? 'Taller: ' + this.planilla.asignatura.detalle : this.planilla.asignatura.detalle,
              style: 'tableHeader',
              fontSize: 10,
              colSpan: 1,
              alignment: 'left',
              border: [true, false, false, false],
            },
            {
              text: `Curso: ${this.planilla.curso.curso} Div.: ${this.planilla.curso.division} Com:${
                this.planilla.curso.comision ? this.planilla.curso.comision : ''
              }`,
              style: 'tableHeader',
              fontSize: 10,
              colSpan: 1,
              alignment: 'center',
              border: [false, false, false, false],
            },
            {
              text: `Prof: ${this.planilla.profesor.nombreCompleto}`,
              fontSize: 10,
              style: 'tableHeader',
              alignment: 'center',
              border: [false, false, true, false],
            },
          ],
        },

        {
          table: {
            widths: [
              '20%',
              '5%',
              '5%', //1 10%
              '5%',
              '5%', //2 20%
              '5%',
              '5%', //3 30%
              '5%',
              '5%', //4 40%
              '5%',
              '5%', //5 50%
              '5%',
              '5%', //6 60%
              '5%',
              '5%', //7 70%
              '5%',
              '5%', //8 80%
            ],
            body: [...this.bodyAlumnos()],
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
  bodyAlumnos() {
    const total = [];
    const subtotal = [];
    const zeroLinea = [
      {
        text: 'Nombre y Apellido',
        bold: false,
        fontSize: 9,
        colSpan: 1,
      },
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' },
    ];
    total.push(zeroLinea);
    this.alumnos.forEach((x) => {
      const primeraLinea = [
        {
          text: x.nombreCompleto,
          bold: false,
          fontSize: 9,
          colSpan: 1,
        },
        { text: '' },
        { text: '' },
        { text: '' },
        { text: '' },
        { text: '' },
        { text: '' },
        { text: '' },
        { text: '' },
        { text: '' },
        { text: '' },
        { text: '' },
        { text: '' },
        { text: '' },
        { text: '' },
        { text: '' },
        { text: '' },
      ];

      //
      total.push(primeraLinea);
      //   total.push(subtotal);
      //   total.push([{ text: '-', color: 'white', colSpan: 2, border: [true, true, true, true] }, {}]);
    });
    return total;
  }
}
