import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { designAnimations } from '@design/animations';
import { ScriptService } from 'app/core/services/plugins/script-excel.service';
import { IAdulto } from 'app/models/interface/iAdulto';
import { IAlumno } from 'app/models/interface/iAlumno';
import { IEstadoCursada } from 'app/models/interface/iEstadoCursada';
import * as moment from 'moment';
declare let pdfMake: any;

@Component({
  selector: 'app-alumno-datos-pdf',
  templateUrl: './alumno-datos-pdf.component.html',
  styleUrls: ['./alumno-datos-pdf.component.scss'],
  animations: [designAnimations],
})
export class AlumnoDatosPdfComponent implements OnInit {
  @Input() cargando: boolean;
  @Input() alumno: IAlumno;
  //   @ViewChild('alumno', null) message: ElementRef;

  constructor(private scriptService: ScriptService) {
    this.scriptService.load('pdfMake', 'vfsFonts');
  }

  ngOnInit(): void {}
  generatePdf(action = 'open') {
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
      content: [
        {
          text: 'Ficha individual del alumno',
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
                  text: 'DATOS ESCOLARES',
                  bold: true,
                  fontSize: 16,
                  fillColor: '#282936',
                  color: '#ffffff',
                },
              ],
              [this.getDatosEscolares()],
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
            widths: ['*', '*', '*', '*', '*'],
            body: [
              [
                {
                  text: 'CURSADAS',
                  bold: true,
                  fontSize: 16,
                  fillColor: '#282936',
                  color: '#ffffff',
                  colSpan: 5,
                },
                {},
                {},
                {},
                {},
              ],
              ['Ciclo Lectivo', 'Curso', 'Comisión', 'División', 'Condición'],
              ...this.getCursadas(),
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
  getCursadas() {
    const retorno = this.alumno.estadoCursadas.map((x: IEstadoCursada) => {
      return [x.cicloLectivo.anio, x.curso.curso, x.curso.comision, x.curso.division, x.condicion];
    });
    console.log('return', retorno);
    return retorno;
  }
  getDatosEscolares() {
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
  getDatosPersonales() {
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
  getAdultos() {
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
            text: x.nombreCompleto,
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
