import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';
import { designAnimations } from '@design/animations';
import { IAsignatura } from 'app/models/interface/iAsignatura';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-asignaturas-tabla-param',
  templateUrl: './asignaturas-tabla-param.component.html',
  styleUrls: ['./asignaturas-tabla-param.component.scss'],
  animations: designAnimations,
})
export class AsignaturasTablaParamComponent implements OnInit, OnChanges {
  @Input() cargando: boolean;
  @Input() asignaturas: IAsignatura[];
  // ALUMNOS ________________________________
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild('sort') set setSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild('paginator') set setPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  columnas: string[] = [
    'asignaturaNro',
    'curso',
    'detalle',
    'tipoAsignatura',
    'tipoCiclo',
    'horasCatedraAnuales',
    'horasCatedraSemanales',
    'tipoFormacion',
    'opciones',
  ];
  // Output
  @Output() retDeshabilitarAsignatura = new EventEmitter<IAsignatura>();
  @Output() retHabilitarAsignatura = new EventEmitter<IAsignatura>();
  constructor(private _permissionsService: NgxPermissionsService, private _router: Router) {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.asignaturas && changes.asignaturas.currentValue) {
      this.dataSource.data = changes.asignaturas.currentValue;
    }
  }
  filtroRapido(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  editar(row: IAsignatura) {
    this._router.navigate(['/parametrizar/asignaturas-editar/' + row._id]);
  }
  ver(row: IAsignatura) {
    this._router.navigate(['/parametrizar/asignaturas-ver/' + row._id]);
  }
  deshabilitar(row: IAsignatura) {
    this.retDeshabilitarAsignatura.emit(row);
  }
  habilitar(row: IAsignatura) {
    this.retHabilitarAsignatura.emit(row);
  }
}
