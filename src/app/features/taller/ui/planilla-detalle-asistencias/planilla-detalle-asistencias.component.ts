import { MediaMatcher, BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { designAnimations } from '@design/animations';
import { TemplateEnum } from 'app/models/constants/tipo-template.const';
import { IAlumno } from 'app/models/interface/iAlumno';
import { IAsistencia } from 'app/models/interface/iAsistencia';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-planilla-detalle-asistencias',
  templateUrl: './planilla-detalle-asistencias.component.html',
  styleUrls: ['./planilla-detalle-asistencias.component.scss'],
  animations: [designAnimations],
})
export class PlanillaDetalleAsistenciasComponent implements OnInit, OnChanges {
  touchtime = 0;

  totalNoRegistradas = { valor: 0, porcentaje: 0 };
  totalAusentes = { valor: 0, porcentaje: 0 };
  totalPresentes = { valor: 0, porcentaje: 0 };
  @Input() totalClases: number;
  @Input() template: TemplateEnum;
  @Input() cargandoAsistencias: boolean;
  @Input() cargandoAlumnos: boolean;
  @Input() alumnos: IAlumno[];
  @Input() asistencias: IAsistencia[];
  titulo = 'Asistencias';
  //   Alumnos
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild('sort') set setSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild('paginator') set setPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  columnas = ['nombreCompleto', 'seguimientoEtap'];
  //   Asistencias
  dataSourceAsistencia: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild('sortAsistencia') set setSortAsistencia(sort: MatSort) {
    this.dataSourceAsistencia.sort = sort;
  }
  @ViewChild('paginatorAsistencia') set setPaginatorAsistencia(paginator: MatPaginator) {
    this.dataSourceAsistencia.paginator = paginator;
  }
  columnasAsistencia = ['fecha', 'presente', 'llegoTarde'];
  @Output() retBuscarAsistenciaPorAlumno = new EventEmitter<IAlumno>();
  @Output() retAbrirModalAsistencias = new EventEmitter<boolean>();
  @Output() retEditarAsistencia = new EventEmitter<IAsistencia>();
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
        this.columnasAsistencia = ['fecha', 'presente', 'llegoTarde'];
      } else {
        this.isMobile = false;
        this.columnasAsistencia = ['fecha', 'presente', 'llegoTarde', 'opciones'];
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.alumnos && changes.alumnos.currentValue) {
      this.dataSource.data = this.alumnos;
    }
    if (changes.totalClases && changes.totalClases.currentValue) {
      console.log('total de clases, ', this.totalClases);
    }
    if (changes.asistencias && changes.asistencias.currentValue) {
      this.dataSourceAsistencia.data = this.asistencias;
      this.calcularEstadisticas();
    }
  }

  ngOnInit(): void {}
  calcularEstadisticas() {
    if (this.totalClases) {
      let tardes: number = 0;
      let presentes = 0;
      let ausentes = 0;
      this.asistencias.forEach((x) => {
        tardes += x.llegoTarde ? 1 : 0;
        presentes += x.presente ? 1 : 0;
        ausentes += !x.presente ? 1 : 0;
      });
      const noRegistradas = this.totalClases - (ausentes + presentes);
      this.totalAusentes = { valor: ausentes, porcentaje: Number(((ausentes * 100) / this.totalClases).toFixed(2)) };
      this.totalPresentes = { valor: presentes, porcentaje: Number(((presentes * 100) / this.totalClases).toFixed(2)) };
      this.totalNoRegistradas = {
        valor: noRegistradas,
        porcentaje: Number(((noRegistradas * 100) / this.totalClases).toFixed(2)),
      };
    }
  }
  filtroRapido(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  filtroRapidoAsistencia(filterValue: string) {
    this.dataSourceAsistencia.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceAsistencia.paginator) {
      this.dataSourceAsistencia.paginator.firstPage();
    }
  }
  buscarAsistenciasPorAlumno(alumno: IAlumno) {
    this.cargandoAsistencias = true;
    this.dataSource.data.forEach((x) => (x.selected = false));
    alumno.selected = true;
    this.asistencias = [];
    this.dataSourceAsistencia.data = [];
    this.retBuscarAsistenciaPorAlumno.emit(alumno);
  }
  realizarBusqueda(alumno: IAlumno) {}
  mostrarModalAsistencias() {
    console.log('mostrarModalAsistencias');
    this.retAbrirModalAsistencias.emit(true);
  }
  editarAsistencia(asistencia: IAsistencia) {
    this.retEditarAsistencia.emit(asistencia);
  }
}
