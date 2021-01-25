import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';
import { designAnimations } from '@design/animations';
import { IComision } from 'app/models/interface/iComision';

@Component({
  selector: 'app-comisiones-tabla-param',
  templateUrl: './comisiones-tabla-param.component.html',
  styleUrls: ['./comisiones-tabla-param.component.scss'],
  animations:designAnimations

})
export class ComisionesTablaParamComponent implements OnInit, OnChanges {
    @Input() soloLectura: boolean = false;
    @Input() cargando: boolean;
    @Input() comisiones: IComision[];
    // ALUMNOS ________________________________
    dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
    @ViewChild('sort') set setSort(sort: MatSort) {
      this.dataSource.sort = sort;
    }
    @ViewChild('paginator') set setPaginator(paginator: MatPaginator) {
      this.dataSource.paginator = paginator;
    }
    columnas: string[] = [
      'comisionNro',
      'comision',
      'alumno',
      'cicloLectivo',
      'curso',
      'division',
      'condicion',
      'opciones',
    ];
    // Output
    @Output() retDeshabilitarComision = new EventEmitter<IComision>();
    @Output() retHabilitarComision = new EventEmitter<IComision>();
    constructor(private _router: Router) {}
  
    ngOnInit(): void {}
    ngOnChanges(changes: SimpleChanges): void {
      if (changes.comisiones && changes.comisiones.currentValue) {
        this.dataSource.data = changes.comisiones.currentValue;
      }
    }
    filtroRapido(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
    editar(row: IComision) {
      this._router.navigate(['/parametrizar/comisiones-editar/' + row._id]);
    }
    ver(row: IComision) {
      this._router.navigate(['/parametrizar/comisiones-ver/' + row._id]);
    }
    deshabilitar(row: IComision) {
      this.retDeshabilitarComision.emit(row);
    }
    habilitar(row: IComision) {
      this.retHabilitarComision.emit(row);
    }

}
