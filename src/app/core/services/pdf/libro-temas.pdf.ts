import { Injectable } from '@angular/core';
import { DesignThemeOptionsModule } from '@design/components';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ScriptService } from '../plugins/script-excel.service';
declare let pdfMake: any;
@Injectable({
  providedIn: 'root',
})
export class LibroTemasPdf {
  temasPorFecha: any[];
  calendario: any[];
  planilla: IPlanillaTaller;
  constructor(private scriptService: ScriptService) {
    this.scriptService.load('pdfMake', 'vfsFonts');
  }

  generatePdf(planilla: IPlanillaTaller, temasPorFecha: any[], action = 'open') {
    this.temasPorFecha = temasPorFecha;
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
          text: 'Libro de Temas',
          bold: true,
          fontSize: 12,
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
        {
          columns: [
            {
              // auto-sized columns have their widths based on their content
              text: this.planilla.asignatura.detalle,
              bold: true,
              fontSize: 10,
              width: '20%',
            },
            {
              // auto-sized columns have their widths based on their content
              text: ` ${this.planilla.curso.curso}° AÑO ${this.planilla.curso.division}° DIV. COM. ${this.planilla.curso.comision}`,
              bold: true,
              fontSize: 10,
              width: '20%',
            },
            {
              // star-sized columns fill the remaining space
              // if there's more than one star-column, available width is divided equally
              text: this.planilla.bimestre,
              width: '20%',
              bold: true,
              fontSize: 10,
            },
            {
              // star-sized columns fill the remaining space
              // if there's more than one star-column, available width is divided equally
              text: `Turno  ${this.planilla.turno}`,
              width: '20%',
              bold: true,
              fontSize: 10,
            },
            {
              // star-sized columns fill the remaining space
              // if there's more than one star-column, available width is divided equally
              text: 'Prof. ' + this.planilla.profesor.nombreCompleto,
              width: '20%',
              bold: true,
              fontSize: 10,
            },
          ],
        },

        {
          table: {
            widths: ['10%', '10%', '10%', '10%', '60%'],
            body: [...this.bodyTemas()],
          },
        },
      ],
      styles: {
        tabla_cursadas: {
          margin: [0, 0, 0, 0],
        },
        tableExample: {},
      },
    };
  }
  bodyTemas() {
    const total = [];
    const subtotal = [];
    const zeroLinea = [
      {
        text: 'Fecha',
        bold: true,
        fontSize: 10,
        colSpan: 1,
        fillColor: '#d9d6d6',
      },
      {
        text: 'Nro Clase',
        bold: false,
        fontSize: 10,
        colSpan: 1,
        fillColor: '#d9d6d6',
      },
      {
        text: 'Unidad',
        bold: false,
        fontSize: 10,
        colSpan: 1,
        fillColor: '#d9d6d6',
      },
      {
        text: 'Caracter Clase',
        bold: false,
        fontSize: 10,
        colSpan: 1,
        fillColor: '#d9d6d6',
      },
      {
        text: 'Desarrollo',
        bold: false,
        fontSize: 10,
        colSpan: 1,
        fillColor: '#d9d6d6',
      },
    ];
    total.push(zeroLinea);
    this.temasPorFecha.forEach((x) => {
      const primeraLinea = [
        {
          border: [false, true, false, false],
          text: moment.utc(x.fecha).format('DD/MM/YYYY'),
          bold: true,
          fontSize: 10,
          colSpan: 1,
        },
        {
          text: x.temaNro,
          border: [false, true, false, false],
          bold: false,
          fontSize: 10,
          colSpan: 1,
        },
        {
          border: [false, true, false, false],
          text: x.unidad,
          bold: false,
          fontSize: 10,
          colSpan: 1,
        },
        {
          text: x.caracterClase,
          border: [false, true, false, false],
          bold: false,
          fontSize: 10,
          colSpan: 1,
        },
        {
          border: [false, true, false, false],
          text: x.temaDelDia,
          bold: false,
          fontSize: 10,
          colSpan: 1,
        },
      ];

      const segundaLinea = [
        {
          border: [false, false, false, true],
          text: 'OBS. JEFE: ' + x.observacionJefe ? x.observacionJefe : ' - ',
          bold: false,
          fontSize: 10,
          colSpan: 5,
        },
        {},
        {},

        {},
        {},
      ];

      //
      total.push(primeraLinea);

      total.push(segundaLinea);

      //   total.push(subtotal);
      //   total.push([{ text: '-', color: 'white', colSpan: 5, border: [false, false, false, false] }, {}, {}, {}, {}]);
    });
    return total;
  }
}
