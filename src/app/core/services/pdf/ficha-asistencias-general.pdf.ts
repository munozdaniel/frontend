import { Injectable } from '@angular/core';
import { IAdulto } from 'app/models/interface/iAdulto';
import { IAsistencia } from 'app/models/interface/iAsistencia';
import { ICalendario } from 'app/models/interface/iCalendario';
import { IEstadoCursada } from 'app/models/interface/iEstadoCursada';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ScriptService } from '../plugins/script-excel.service';
declare let pdfMake: any;
@Injectable({
  providedIn: 'root',
})
export class FichaAsistenciaGeneralPdf {
  alumnoAsistencias: any[];
  calendario: any[];
  planilla: IPlanillaTaller;
  constructor(private scriptService: ScriptService) {
    this.scriptService.load('pdfMake', 'vfsFonts');
  }

  generatePdf(planilla: IPlanillaTaller, alumnoAsistencias: any[], action = 'open') {
    this.alumnoAsistencias = alumnoAsistencias;
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
          text: 'Planilla de Asistencia',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
        this.tablaAsistencias(),
      ],
      styles: {
        tabla_cursadas: {
          margin: [0, 20, 0, 0],
        },
        tableExample: {},
      },
    };
  }
  tablaAsistencias() {
    const totalCol = this.calendario.length;
    console.log(
      [
        '20%',
        ...this.calendario.map((x) => 'auto'),
        //   ((totalCol / 80) * 100).toString() + '%'
      ].length,
      'cosas',
      this.calendario.map((x) => ((totalCol / 80) * 100).toString() + '%')
    );
    return {
      style: 'tabla1',
      table: {
        widths: [
          '20%',
          ...this.calendario.map((x) => 'auto'),
          //   ((totalCol / 80) * 100).toString() + '%'
        ],
        body: [
          [
            {
              text: 'Alumnos',
              bold: true,
              fontSize: 9,

              //   fillColor: '#282936',
              //   color: '#ffffff',
            },
            ...this.calendario.map((x) => ({ text: moment.utc(x.fecha).format('DD/MM/YYYY'), fontSize: 9, bold: false })),
          ],
          ...this.contenido(),
        ],
      },
    };
  }
  contenido() {
    const contenido = this.alumnoAsistencias.map((x) => {
      const alumno = {
        text: x.alumno,
        fontSize: 9,
        bold: true,
      };
      const asistenciasCol = [];
      for (let index = 0; index < this.calendario.length; index++) {
        const fechaCalendario = this.calendario[index].fecha;
        const i = x.asistencias.findIndex((a) => moment(fechaCalendario).utc().isSame(a.fecha));
        if (i === -1) {
          asistenciasCol.push({ text: '' });
        } else {
          // moment.utc(x.asistencias[i]).format('DD/MM')
          console.log('x.asistencias', x.asistencias[i]);
          asistenciasCol.push({
            text: x.asistencias[i].presente ? 'SI' : 'NO',
            fontSize: 9,
          });
        }
      }
      return [alumno, ...asistenciasCol];
    });
    console.log('contenido', contenido);
    return contenido;
  }
}
