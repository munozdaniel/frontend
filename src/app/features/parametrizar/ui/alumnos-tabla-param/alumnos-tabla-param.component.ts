import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';
import { designAnimations } from '@design/animations';
import { IAlumno } from 'app/models/interface/iAlumno';
import { IPaginado } from 'app/models/interface/iPaginado';

@Component({
  selector: 'app-alumnos-tabla-param',
  templateUrl: './alumnos-tabla-param.component.html',
  styleUrls: ['./alumnos-tabla-param.component.scss'],
  animations: designAnimations,
})
export class AlumnosTablaParamComponent implements OnInit, OnChanges {
  @Input() cargando: boolean;
  // ALUMNOS ________________________________
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild('sort') set setSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild('paginator') set setPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  columnas: string[] = ['identificador', 'nombre', 'dni', 'seguimientoEtap', 'opciones'];
  // Input
  @Input() alumnos: IAlumno[];
  @Input() total: number;
  @Input() totalAlumnosPorPagina: number;
  // Output
  @Output() retEliminarAlumno = new EventEmitter<IAlumno>();
  @Output() retCambiarPagina = new EventEmitter<IPaginado>();
  constructor(private _router: Router) {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.alumnos && changes.alumnos.currentValue) {
      this.dataSource.data = changes.alumnos.currentValue;
    }
  }
  filtroRapido(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  editar(row: IAlumno) {
    this._router.navigate(['/parametrizar/alumnos-editar/' + row._id]);
  }
  eliminar(row: IAlumno) {
    this.retEliminarAlumno.emit(row);
  }
  cambioPagina(evento: IPaginado) {
    console.log('cambioPagina', evento);
    this.retCambiarPagina.emit(evento);
  }
}
