import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { designAnimations } from '@design/animations';
import { IAlumno } from 'app/models/interface/iAlumno';

@Component({
  selector: 'app-seguimiento-busqueda-alumno',
  templateUrl: './seguimiento-busqueda-alumno.component.html',
  styleUrls: ['./seguimiento-busqueda-alumno.component.scss'],
  animations: [designAnimations],
})
export class SeguimientoBusquedaAlumnoComponent implements OnInit, OnChanges {
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild('sort') set setSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild('paginator') set setPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  columnas: string[] = ['alumnoNro', 'nombre', 'dni', 'opciones'];
  // Input
  @Input() cargando: boolean;
  @Input() alumnos: IAlumno[];
  @Output() retAlumno = new EventEmitter<IAlumno>();

  constructor() {}

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
  seleccionar(alumno: IAlumno) {
    this.retAlumno.emit(alumno);
  }
}
