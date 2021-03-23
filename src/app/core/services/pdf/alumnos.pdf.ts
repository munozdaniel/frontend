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
export class AlumnosPdf {
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
          columns: [
            {
              // auto-sized columns have their widths based on their content
              text: 'Curso: ' + this.planilla.curso.curso,
              bold: true,
              fontSize: 16,
              alignment: 'left',
              width: '25%',
            },
            {
              // auto-sized columns have their widths based on their content
              text: 'Div.: ' + this.planilla.curso.division,
              bold: true,
              fontSize: 16,
              alignment: 'left',
              width: '25%',
            },
            {
              // auto-sized columns have their widths based on their content
              text: 'Com.: ' + this.planilla.curso.comision,
              bold: true,
              fontSize: 16,
              alignment: 'left',
              width: '25%',
            },
            {
              // auto-sized columns have their widths based on their content
              text: this.planilla.bimestre,
              bold: true,
              fontSize: 16,
              alignment: 'right',
              width: '25%',
            },
           
          ],
        },

        {
          table: {
            widths: ['20%', '80%'],
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
    this.alumnos.forEach((x) => {
      const zeroLinea = [
        {
          text: 'Legajo',
          bold: true,
          fontSize: 12,
          colSpan: 1,
          fillColor: '#d9d6d6',
        },
        {
          text: 'Nombre y Apellido',
          bold: false,
          fontSize: 12,
          colSpan: 1,
          fillColor: '#d9d6d6',
        },
      ];
      const primeraLinea = [
        {
          text: x.legajo,
          bold: true,
          fontSize: 12,
          colSpan: 1,
        },
        {
          text: x.nombreCompleto,
          bold: false,
          fontSize: 12,
          colSpan: 1,
        },
      ];

      //
      total.push(zeroLinea);
      total.push(primeraLinea);
      //   total.push(subtotal);
      total.push([{ text: '-', color: 'white', colSpan: 2, border: [false, false, false, false] }, {}]);
    });
    return total;
  }
}
