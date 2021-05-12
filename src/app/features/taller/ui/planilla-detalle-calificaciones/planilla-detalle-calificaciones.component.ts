import { MediaMatcher, BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { designAnimations } from '@design/animations';
import { TemplateEnum } from 'app/models/constants/tipo-template.const';
import { IAlumno } from 'app/models/interface/iAlumno';
import { ICalificacion } from 'app/models/interface/iCalificacion';

@Component({
  selector: 'app-planilla-detalle-calificaciones',
  templateUrl: './planilla-detalle-calificaciones.component.html',
  styleUrls: ['./planilla-detalle-calificaciones.component.scss'],
  animations: [designAnimations],
})
export class PlanillaDetalleCalificacionesComponent implements OnInit, OnChanges {
  TemplateEnum = TemplateEnum;
  touchtime = 0;
  @Input() template?: TemplateEnum;
  @Input() cargandoCalificaciones: boolean;
  @Input() cargandoAlumnos: boolean;
  @Input() alumnos: IAlumno[];
  @Input() calificaciones: ICalificacion[];
  @Output() retBuscarCalificacionesPorAlumno = new EventEmitter<IAlumno>();
  @Output() retAbrirModalCalificaciones = new EventEmitter<boolean>();
  @Output() retEditarCalificacion = new EventEmitter<ICalificacion>();
  @Output() retEliminarCalificacion = new EventEmitter<ICalificacion>();
  titulo = 'Calificaciones';
  //   Alumnos
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild('sort') set setSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild('paginator') set setPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  columnas = ['nombreCompleto', 'seguimientoEtap'];
  //   Calificaciones
  dataSourceCalificacion: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild('sortCalificacion') set setSortCalificacion(sort: MatSort) {
    this.dataSourceCalificacion.sort = sort;
  }
  @ViewChild('paginatorCalificacion') set setPaginatorCalificacion(paginator: MatPaginator) {
    this.dataSourceCalificacion.paginator = paginator;
  }
  columnasCalificacion = ['formaExamen', 'tipoExamen', 'promedia', 'promedioGeneral'];
  //
  promedio = '0';
  promedioFinal = '0';
  totalCalificaciones = 0;
  totalPromedios = 0;
  mostrarLeyenda = true;
  // Mobile
  isMobile: boolean;
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  constructor(private _changeDetectorRef: ChangeDetectorRef, private _media: MediaMatcher, public breakpointObserver: BreakpointObserver) {
    this.mobileQuery = this._media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this._changeDetectorRef.detectChanges();
    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.HandsetPortrait]).subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.isMobile = true;
        this.columnasCalificacion = ['formaExamen_xs', 'promedia', 'promedioGeneral'];
      } else {
        this.isMobile = false;
        this.columnasCalificacion = ['formaExamen', 'tipoExamen', 'promedia', 'promedioGeneral'];
      }
      if (this.template === TemplateEnum.EDICION) {
        this.columnasCalificacion = [...this.columnasCalificacion, 'opciones'];
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.alumnos && changes.alumnos.currentValue) {
      this.dataSource.data = this.alumnos;
      if (this.template === TemplateEnum.EDICION) {
        this.columnasCalificacion = [...this.columnasCalificacion, 'opciones'];
      }
    }
    if (changes.calificaciones && changes.calificaciones.currentValue) {
      this.totalCalificaciones = 0;
      this.totalPromedios = 0;
      this.promedio = null;
      this.promedioFinal = null;
      this.dataSourceCalificacion.data = this.calificaciones;
      if (this.calificaciones.length > 0) {
        let suma = 0;
        this.totalPromedios = 0;
        this.totalCalificaciones = this.calificaciones.length;
        this.calificaciones.forEach((x) => {
          if (x.promedia) {
            this.totalPromedios += 1;
            suma += x.promedioGeneral;
          }
        });
        // this.promedio = (suma / this.totalCalificaciones).toFixed(2);
        this.promedio = (suma / this.totalPromedios).toFixed(2);
        this.promedioFinal = (Math.ceil(Number(this.promedio) * 2) / 2).toFixed(2);
      }
    }
  }

  ngOnInit(): void {}
  filtroRapido(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  filtroRapidoCalificacion(filterValue: string) {
    this.dataSourceCalificacion.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceCalificacion.paginator) {
      this.dataSourceCalificacion.paginator.firstPage();
    }
  }
  buscarCalificacionesPorAlumno(alumno: IAlumno) {
    this.cargandoCalificaciones = true;
    this.dataSource.data.forEach((x) => (x.selected = false));
    alumno.selected = true;
    this.calificaciones = [];
    this.dataSourceCalificacion.data = [];
    this.retBuscarCalificacionesPorAlumno.emit(alumno);
  }
  mostrarModalCalificacion() {
    this.retAbrirModalCalificaciones.emit(true);
  }
  editarCalificacion(asistencia: ICalificacion) {
    this.retEditarCalificacion.emit(asistencia);

    // if (!this.isMobile) {
    //   this.retEditarCalificacion.emit(asistencia);
    // } else {
    //   this.mostrarLeyenda = false;
    //   this.simularDobleClick(asistencia);
    // }
  }
  //   simularDobleClick(asistencia: ICalificacion) {
  //     if (this.touchtime == 0) {
  //       // set first click
  //       this.touchtime = new Date().getTime();
  //     } else {
  //       // compare first click to this click and see if they occurred within double click threshold
  //       if (new Date().getTime() - this.touchtime < 500) {
  //         // double click occurred
  //         this.retEditarCalificacion.emit(asistencia);
  //         this.touchtime = 0;
  //       } else {
  //         // not a double click so set as a new first click
  //         this.touchtime = new Date().getTime();
  //       }
  //     }
  //   }

  eliminar(calificacion: ICalificacion) {
    this.retEliminarCalificacion.emit(calificacion);
  }
}
