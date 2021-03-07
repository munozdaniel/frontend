import { EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Component, OnChanges, OnInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { designAnimations } from '@design/animations';
import { IAlumno } from 'app/models/interface/iAlumno';

@Component({
  selector: 'app-tabla-alumnos',
  templateUrl: './tabla-alumnos.component.html',
  styleUrls: ['./tabla-alumnos.component.scss'],
  animations: [designAnimations],
})
export class TablaAlumnosComponent implements OnInit, OnChanges {
  @Input() cargandoAlumnos: boolean;
  @Input() alumnos: IAlumno[];
  @Output() retAlumnoSeleccionado = new EventEmitter<IAlumno>();
  //   Alumnos
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild('sort') set setSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild('paginator') set setPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  columnas = ['nombreCompleto', 'seguimientoEtap'];
  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.alumnos && changes.alumnos.currentValue) {
      this.dataSource.data = this.alumnos;
    }
  }
  ngOnInit(): void {}
  filtroRapido(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  seleccionarAlumno(alumno: IAlumno) {
    this.dataSource.data.forEach((x) => (x.selected = false));
    alumno.selected = true;
    this.retAlumnoSeleccionado.emit(alumno);
  }
}
