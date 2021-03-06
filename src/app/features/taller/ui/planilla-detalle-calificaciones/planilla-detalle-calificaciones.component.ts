import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { designAnimations } from '@design/animations';
import { IAlumno } from 'app/models/interface/iAlumno';
import { ICalificacion } from 'app/models/interface/iCalificacion';

@Component({
  selector: 'app-planilla-detalle-calificaciones',
  templateUrl: './planilla-detalle-calificaciones.component.html',
  styleUrls: ['./planilla-detalle-calificaciones.component.scss'],
  animations: [designAnimations],
})
export class PlanillaDetalleCalificacionesComponent implements OnInit, OnChanges {
  @Input() cargandoCalificaciones: boolean;
  @Input() cargandoAlumnos: boolean;
  @Input() alumnos: IAlumno[];
  @Input() calificaciones: ICalificacion[];
  @Output() retBuscarCalificacionesPorAlumno = new EventEmitter<IAlumno>();
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
  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.alumnos && changes.alumnos.currentValue) {
      this.dataSource.data = this.alumnos;
    }
    if (changes.calificaciones && changes.calificaciones.currentValue) {
      this.dataSourceCalificacion.data = this.calificaciones;
    }
  }

  ngOnInit(): void {
  }
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
}
