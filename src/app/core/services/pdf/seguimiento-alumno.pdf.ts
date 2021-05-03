import { Injectable } from '@angular/core';
import { IAdulto } from 'app/models/interface/iAdulto';
import { IAlumno } from 'app/models/interface/iAlumno';
import { IEstadoCursada } from 'app/models/interface/iEstadoCursada';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import { ISeguimientoAlumno } from 'app/models/interface/iSeguimientoAlumno';
import * as moment from 'moment';
import { ScriptService } from '../plugins/script-excel.service';
declare let pdfMake: any;
@Injectable({
  providedIn: 'root',
})
export class SeguimientoAlumnoPdf {
  planilla: IPlanillaTaller;
  alumno: IAlumno;
  seguimientos: ISeguimientoAlumno[];
  constructor(private scriptService: ScriptService) {
    this.scriptService.load('pdfMake', 'vfsFonts');
  }

  generatePdf(alumno: IAlumno, seguimientos: ISeguimientoAlumno[], action = 'open') {
    this.alumno = alumno;
    this.seguimientos = [...seguimientos];
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
  generatePdfPorPlanilla(planilla: IPlanillaTaller, seguimientos: [], action = 'open') {
    this.planilla = planilla;
    this.seguimientos = [...seguimientos];
    const documentDefinition = this.getDocumentoPorPlanilla();
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
  //   En la planillaTaller
  private getDocumentoPorPlanilla() {
    return {
      content: [
        {
          text: 'Seguimiento de Alumno',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
        {
          style: 'tabla_datos_personales',
          color: '#444',
          table: {
            widths: ['100%', '100%'],
            body: [
              [
                {
                  text: 'DATOS PERSONALES',
                  bold: true,
                  fontSize: 16,
                  fillColor: '#282936',
                  color: '#ffffff',
                },
              ],
              [this.getDatosPersonales()],

              [
                {
                  text: 'ADULTOS A CARGO',
                  bold: true,
                  fontSize: 16,
                  fillColor: '#282936',
                  color: '#ffffff',
                },
              ],
              [this.getAdultos()],
              [
                {
                  text: 'Cantidad de Integrantes en la familia: ' + this.alumno.adultos.length,
                  bold: true,
                },
              ],
            ],
          },
          //   layout: { vLineColor: 'red' },
        },
        {
          style: 'tabla_cursadas',
          color: '#444',
          table: {
            widths: ['*', '*', '*', '*'],
            body: [
              [
                {
                  text: 'INFORME',
                  bold: true,
                  fontSize: 16,
                  fillColor: '#282936',
                  color: '#ffffff',
                  colSpan: 4,
                },
                {},
                {},
                {},
              ],
              ['Ciclo Lectivo', 'Fecha', 'Tipo de Seguimiento', 'Observación'],
              ...this.getSeguimientos(),
            ],
          },
        },
      ],
      styles: {
        tabla_cursadas: {
          margin: [0, 20, 0, 0],
        },
      },
    };
  }
  //   Individual ... el otro
  private getDocumentDefinition() {
    return {
      content: [
        {
          text: 'Seguimiento de Alumno',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
        {
          style: 'tabla_datos_personales',
          color: '#444',
          table: {
            widths: ['100%', '100%'],
            body: [
              [
                {
                  text: 'DATOS PERSONALES',
                  bold: true,
                  fontSize: 16,
                  fillColor: '#282936',
                  color: '#ffffff',
                },
              ],
              [this.getDatosPersonales()],

              [
                {
                  text: 'ADULTOS A CARGO',
                  bold: true,
                  fontSize: 16,
                  fillColor: '#282936',
                  color: '#ffffff',
                },
              ],
              [this.getAdultos()],
              [
                {
                  text: 'Cantidad de Integrantes en la familia: ' + this.alumno.adultos.length,
                  bold: true,
                },
              ],
            ],
          },
          //   layout: { vLineColor: 'red' },
        },
        {
          style: 'tabla_cursadas',
          color: '#444',
          table: {
            widths: ['*', '*', '*', '*'],
            body: [
              [
                {
                  text: 'INFORME',
                  bold: true,
                  fontSize: 16,
                  fillColor: '#282936',
                  color: '#ffffff',
                  colSpan: 4,
                },
                {},
                {},
                {},
              ],
              ['Ciclo Lectivo', 'Fecha', 'Tipo de Seguimiento', 'Observación'],
              ...this.getSeguimientos(),
            ],
          },
        },
      ],
      styles: {
        tabla_cursadas: {
          margin: [0, 20, 0, 0],
        },
      },
    };
  }
  private getSeguimientos() {
    const retorno = this.seguimientos.map((x: ISeguimientoAlumno) => {
      return [x.cicloLectivo.anio, moment.utc(x.fecha).format('DD/MM/YYYY'), x.tipoSeguimiento, x.observacion];
    });
    return retorno;
  }
  private getDatosEscolares() {
    return {
      columns: [
        [
          {
            // auto-sized columns have their widths based on their content
            width: '30%',
            text: 'Procedencia Colegio Primario',
            alignment: 'start',
            margin: [0, 0, 5, 0],
          },
          {
            // auto-sized columns have their widths based on their content
            width: '30%',
            text: 'Procedencia Colegio Secundario',
            alignment: 'start',
            margin: [0, 0, 5, 0],
          },
        ],
        [
          {
            // auto-sized columns have their widths based on their content
            width: '70%',
            text: this.alumno.procedenciaColegioPrimario ? this.alumno.procedenciaColegioPrimario : 'Sin Registrar',
            alignment: 'start',
            margin: [0, 0, 5, 0],
          },
          {
            // auto-sized columns have their widths based on their content
            width: '70%',
            text: this.alumno.procedenciaColegioSecundario ? this.alumno.procedenciaColegioSecundario : 'Sin Registrar',
            alignment: 'start',
            margin: [0, 0, 5, 0],
          },
        ],
      ],
      columnGap: 10,
    };
  }
  private getDatosPersonales() {
    const retorno = {
      columns: [
        [
          {
            // auto-sized columns have their widths based on their content
            width: '30%',
            text: 'Legajo',
            alignment: 'start',
            margin: [0, 0, 5, 0],
          },
          {
            width: '30%',
            text: 'Documento',
            alignment: 'start',
            margin: [0, 0, 5, 0],
          },
          {
            width: '30%',
            text: 'Apellido y Nombre',
            alignment: 'start',
            margin: [0, 0, 5, 0],
          },
          {
            width: '30%',
            text: 'Fecha Nacimiento',
            alignment: 'start',
            margin: [0, 0, 5, 0],
          },
          {
            width: '30%',
            text: 'Sexo',
            alignment: 'start',
            margin: [0, 0, 5, 0],
          },
          {
            width: '30%',
            text: 'Nacionalidad',
            alignment: 'start',
            margin: [0, 0, 5, 0],
          },
          {
            width: '30%',
            text: 'Telefono',
            alignment: 'start',
            margin: [0, 0, 5, 0],
          },
          {
            width: '30%',
            text: 'Celular',
            alignment: 'start',
            margin: [0, 0, 5, 0],
          },
          {
            width: '30%',
            text: 'Email',
            alignment: 'start',
            margin: [0, 0, 5, 0],
          },
        ],
        [
          {
            // auto-sized columns have their widths based on their content
            width: '70%',
            text: this.alumno.legajo,
            alignment: 'start',
          },
          {
            // star-sized columns fill the remaining space
            // if there's more than one star-column, available width is divided equally
            width: '70%',
            text: this.alumno.tipoDni + '' + this.alumno.dni,
            alignment: 'start',
          },
          {
            // auto-sized columns have their widths based on their content
            width: '70%',
            text: this.alumno.nombreCompleto,
            alignment: 'start',
          },
          {
            // auto-sized columns have their widths based on their content
            width: '70%',
            text: this.alumno.fechaNacimiento ? moment.utc(this.alumno.fechaNacimiento).format('DD/MM/YYYY').toString() : 'Sin Registrar',
            alignment: 'start',
          },
          {
            // auto-sized columns have their widths based on their content
            width: '70%',
            text: this.alumno.sexo,
            alignment: 'start',
            italics: this.alumno.sexo ? false : true,
          },
          {
            // auto-sized columns have their widths based on their content
            width: '70%',
            text: this.alumno.nacionalidad,
            alignment: 'start',
          },
          {
            // auto-sized columns have their widths based on their content
            width: '70%',
            text: this.alumno.telefono ? this.alumno.telefono : 'Sin Registrar',
            alignment: 'start',
          },
          {
            // auto-sized columns have their widths based on their content
            width: '70%',
            text: this.alumno.celular ? this.alumno.celular : 'Sin Registrar',
            alignment: 'start',
          },
          {
            // auto-sized columns have their widths based on their content
            width: '70%',
            text: this.alumno.email ? this.alumno.email : 'Sin Registrar',
            alignment: 'start',
          },
        ],
      ],
      columnGap: 10,
    };
    return retorno;
  }
  private getAdultos() {
    const columnas = [];
    if (this.alumno.adultos.length > 0) {
      this.alumno.adultos.forEach((x: IAdulto) => {
        const col1 = [
          {
            // auto-sized columns have their widths based on their content
            width: '30%',
            text: x.tipoAdulto,
            alignment: 'start',
            margin: [0, 0, 5, 0],
            bold: true,
          },
          {
            // auto-sized columns have their widths based on their content
            width: '30%',
            text: 'Nombre Completo',
            alignment: 'start',
            margin: [0, 0, 5, 0],
          },
          {
            // auto-sized columns have their widths based on their content
            width: '30%',
            text: 'Télefono',
            alignment: 'start',
            margin: [0, 0, 5, 0],
          },
          {
            // auto-sized columns have their widths based on their content
            width: '30%',
            text: 'Email',
            alignment: 'start',
            margin: [0, 0, 5, 0],
          },
        ];
        const col2 = [
          {
            // auto-sized columns have their widths based on their content
            width: '70%',
            text: x.tipoAdulto,
            alignment: 'start',
            margin: [0, 0, 5, 0],
            color: '#FFFFFF',
          },
          {
            // auto-sized columns have their widths based on their content
            width: '70%',
            text: x.nombreCompleto ? x.nombreCompleto : 'Sin Registrar',
            alignment: 'start',
            margin: [0, 0, 5, 0],
          },
          {
            // auto-sized columns have their widths based on their content
            width: '70%',
            text: x.telefono ? x.telefono : 'Sin Registrar',
            alignment: 'start',
            margin: [0, 0, 5, 0],
          },
          {
            // auto-sized columns have their widths based on their content
            width: '70%',
            text: x.email ? x.email : 'Sin Registrar',
            alignment: 'start',
            margin: [0, 0, 5, 0],
          },
        ];

        columnas.push({ columns: [col1, col2], columnGap: 10 });
      });
      // return columnas;
    } else {
      columnas.push({
        columns: [
          {
            // auto-sized columns have their widths based on their content
            width: '70%',
            text: 'El alumno no registra adultos a cargo',
            color: 'red',
            alignment: 'start',
            margin: [0, 0, 5, 0],
          },
        ],
        columnGap: 10,
      });
    }
    return columnas;
  }
}
