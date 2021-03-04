import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { designAnimations } from '@design/animations';
import { IAlumno } from 'app/models/interface/iAlumno';
import { IAsistencia } from 'app/models/interface/IAsistencia';

@Component({
  selector: 'app-planilla-detalle-asistencias',
  templateUrl: './planilla-detalle-asistencias.component.html',
  styleUrls: ['./planilla-detalle-asistencias.component.scss'],
  animations: [designAnimations],
})
export class PlanillaDetalleAsistenciasComponent implements OnInit, OnChanges {
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

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.alumnos && changes.alumnos.currentValue) {
      this.dataSource.data = this.alumnos;
    }
    if (changes.asistencia && changes.asistencia.currentValue) {
      this.dataSourceAsistencia.data = this.alumnos;
    }
  }

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
