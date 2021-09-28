import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-planilla-detalle-informes',
  templateUrl: './planilla-detalle-informes.component.html',
  styleUrls: ['./planilla-detalle-informes.component.scss'],
})
export class PlanillaDetalleInformesComponent implements OnInit {
  listaA = [
    // {
    //   id: 1,
    //   titulo: 'Listado de Asistencias por Taller ',
    //   subtitulo: 'GENERAL',
    // },
    // {
    //   id: 2,
    //   titulo: 'Listado de Asistencias por Taller ',
    //   subtitulo: 'TALLER POR DÍA',
    // },
    // {
    //   id: 3,
    //   titulo: 'Listado de Calificaciones por Taller ',
    //   subtitulo: 'DETALLADO',
    // },
    // {
    //   id: 4,
    //   titulo: 'Listado de Calificaciones por Taller ',
    //   subtitulo: 'RESUMIDO',
    // },
    {
      id: 6,
      titulo: 'Libro de Temas',
      subtitulo: 'GENERAL',
    },
    {
      id: 9,
      titulo: 'Template del Taller',
      subtitulo: 'GENERAL',
    },
    // {
    //   id: 9,
    //   titulo: 'Promedios del Taller ',
    //   subtitulo: 'POR ALUMNOS',
    // },
  ];
  listaB = [
    // {
    //   id: 5,
    //   titulo: 'Seguimiento de Alumnos por Taller',
    //   subtitulo: 'GENERAL',
    // },

    // {
    //   id: 7,
    //   titulo: 'Resumen de Taller por Alumnos',
    //   subtitulo: 'TUTORES',
    // },
    {
      id: 8,
      titulo: 'Listado de Alumnos por Taller ',
      subtitulo: 'GENERAL',
    },
  ];
  @Input() cargando: boolean;
  @Output() retInformeAsistenciaPorTaller = new EventEmitter<boolean>();
  @Output() retInformeAsistenciaPorDia = new EventEmitter<boolean>();
  @Output() retInformeCalificacionesPorTaller = new EventEmitter<boolean>();
  @Output() retInformeCalificacionesResumido = new EventEmitter<boolean>();
  @Output() retSeguimientoPorTaller = new EventEmitter<boolean>();
  @Output() retInformeLibroDeTemas = new EventEmitter<boolean>();
  @Output() retInformeResumenTallerPorAlumnos = new EventEmitter<boolean>();
  @Output() retInformeListadoAlumnosTaller = new EventEmitter<boolean>();
  @Output() retTemplatePlanillaTaller = new EventEmitter<boolean>();
  constructor() {}

  ngOnInit(): void {}
  verInforme(id: number) {
    if (this.cargando) {
      return;
    }
    switch (id) {
      case 1:
        this.retInformeAsistenciaPorTaller.emit(true);
        break;
      case 2:
        this.retInformeAsistenciaPorDia.emit(true);
        break;
      case 3:
        this.retInformeCalificacionesPorTaller.emit(true);
        break;
      case 4:
        this.retInformeCalificacionesResumido.emit(true);
        break;
      case 5:
        this.retSeguimientoPorTaller.emit(true);
        break;
      case 6:
        this.retInformeLibroDeTemas.emit(true);
        break;
      case 7:
        this.retInformeResumenTallerPorAlumnos.emit(true);
        break;
      case 8:
        this.retInformeListadoAlumnosTaller.emit(true);
        break;
        case 9:
          this.retTemplatePlanillaTaller.emit(true);
        break;

      default:
        break;
    }
  }
}
