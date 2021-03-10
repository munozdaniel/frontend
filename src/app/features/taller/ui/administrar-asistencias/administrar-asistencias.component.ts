import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { IAlumno } from 'app/models/interface/iAlumno';
import { IAsistencia } from 'app/models/interface/iAsistencia';

@Component({
  selector: 'app-administrar-asistencias',
  templateUrl: './administrar-asistencias.component.html',
  styleUrls: ['./administrar-asistencias.component.scss'],
})
export class AdministrarAsistenciasComponent implements OnInit {
  @Input() cargandoAsistencias: boolean;
  @Input() cargandoAlumnos: boolean;
  @Input() alumnos: IAlumno[] & IAsistencia[];
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
  constructor() {}

  ngOnInit(): void {}
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
}
