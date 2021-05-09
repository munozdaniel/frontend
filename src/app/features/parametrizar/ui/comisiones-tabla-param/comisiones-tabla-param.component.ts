import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';
import { designAnimations } from '@design/animations';
import { ICurso } from 'app/models/interface/iCurso';
import { IEstadoCursada } from 'app/models/interface/iEstadoCursada';

@Component({
  selector: 'app-comisiones-tabla-param',
  templateUrl: './comisiones-tabla-param.component.html',
  styleUrls: ['./comisiones-tabla-param.component.scss'],
  animations: designAnimations,
})
export class ComisionesTablaParamComponent implements OnInit, OnChanges {
  @Input() soloLectura: boolean = false;
  @Input() cargando: boolean;
  @Input() estadoCursadas: IEstadoCursada[];
  // ALUMNOS ________________________________
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild('sort') set setSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild('paginator') set setPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  columnas: string[] = ['cicloLectivo', 'curso', 'division', 'comision', 'condicion', 'opciones'];
  // Output
  @Output() retEditarComision = new EventEmitter<ICurso>();
  @Output() retEliminarComision = new EventEmitter<ICurso>();
  @Output() retDeshabilitarComision = new EventEmitter<ICurso>();
  @Output() retHabilitarComision = new EventEmitter<ICurso>();
  constructor(private _router: Router) {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.estadoCursadas && changes.estadoCursadas.currentValue) {
      console.log('estadoCursadas', this.estadoCursadas);
      this.dataSource.data = changes.estadoCursadas.currentValue;
    }
  }
  filtroRapido(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  eliminar(row: ICurso) {
    this.retEliminarComision.emit(row);
  }
  editar(row: ICurso) {
    this.retEditarComision.emit(row);

    //   this._router.navigate(['/parametrizar/comisiones-editar/' + row._id]);
  }
  ver(row: ICurso) {
    this._router.navigate(['/parametrizar/comisiones-ver/' + row._id]);
  }
  deshabilitar(row: ICurso) {
    this.retDeshabilitarComision.emit(row);
  }
  habilitar(row: ICurso) {
    this.retHabilitarComision.emit(row);
  }
}
