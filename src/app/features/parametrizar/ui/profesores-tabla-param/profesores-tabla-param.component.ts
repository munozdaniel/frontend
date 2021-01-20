import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';
import { designAnimations } from '@design/animations';
import { IProfesor } from 'app/models/interface/iProfesor';

@Component({
  selector: 'app-profesores-tabla-param',
  templateUrl: './profesores-tabla-param.component.html',
  styleUrls: ['./profesores-tabla-param.component.scss'],
  animations:designAnimations
})
export class ProfesoresTablaParamComponent implements OnInit {
    @Input() cargando: boolean;
    @Input() profesores: IProfesor[];
    // ALUMNOS ________________________________
    dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
    @ViewChild('sort') set setSort(sort: MatSort) {
      this.dataSource.sort = sort;
    }
    @ViewChild('paginator') set setPaginator(paginator: MatPaginator) {
      this.dataSource.paginator = paginator;
    }
    columnas: string[] = [
      'profesorNro',
      'nombreCompleto',
      'telefono',
      'email',
      'formacion',
      'titulo',
      'opciones',
    ];
    // Output
    @Output() retDeshabilitarProfesor = new EventEmitter<IProfesor>();
    @Output() retHabilitarProfesor = new EventEmitter<IProfesor>();
    constructor(private _router: Router) {}
  
    ngOnInit(): void {}
    ngOnChanges(changes: SimpleChanges): void {
      if (changes.profesores && changes.profesores.currentValue) {
        this.dataSource.data = changes.profesores.currentValue;
      }
    }
    filtroRapido(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
    editar(row: IProfesor) {
      this._router.navigate(['/parametrizar/profesores-editar/' + row._id]);
    }
    ver(row: IProfesor) {
      this._router.navigate(['/parametrizar/profesores-ver/' + row._id]);
    }
    deshabilitar(row: IProfesor) {
      this.retDeshabilitarProfesor.emit(row);
    }
    habilitar(row: IProfesor) {
      this.retHabilitarProfesor.emit(row);
    }

}
