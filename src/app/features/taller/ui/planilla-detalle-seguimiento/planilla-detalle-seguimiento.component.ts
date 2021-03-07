import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { designAnimations } from '@design/animations';
import { IAlumno } from 'app/models/interface/iAlumno';
import { ISeguimientoAlumno } from 'app/models/interface/iSeguimientoAlumno';
import { VerSeguimientoModalComponent } from '../ver-seguimiento-modal/ver-seguimiento-modal.component';

@Component({
  selector: 'app-planilla-detalle-seguimiento',
  templateUrl: './planilla-detalle-seguimiento.component.html',
  styleUrls: ['./planilla-detalle-seguimiento.component.scss'],
  animations: [designAnimations],
})
export class PlanillaDetalleSeguimientoComponent implements OnInit, OnChanges {
  @Input() cargandoAlumnos: boolean;
  @Input() alumnos: IAlumno[];
  @Input() seguimientos: ISeguimientoAlumno[];
  @Input() cargandoSeguimiento: boolean;
  @Output() retBuscarSeguimientosPorAlumno = new EventEmitter<IAlumno>();

  //   Alumnos
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild('sort') set setSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild('paginator') set setPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  columnas = ['nombreCompleto', 'seguimientoEtap'];
  //   Seguimientoes
  dataSourceSeguimiento: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild('sortSeguimiento') set setSortSeguimiento(sort: MatSort) {
    this.dataSourceSeguimiento.sort = sort;
  }
  @ViewChild('paginatorSeguimiento') set setPaginatorSeguimiento(paginator: MatPaginator) {
    this.dataSourceSeguimiento.paginator = paginator;
  }
  columnasSeguimiento = ['fecha', 'tipoSeguimiento', 'resuelto', 'opciones'];
  constructor(public dialog: MatDialog) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.alumnos && changes.alumnos.currentValue) {
      this.dataSource.data = this.alumnos;
    }
    if (changes.seguimientos && changes.seguimientos.currentValue) {
      this.dataSourceSeguimiento.data = this.seguimientos;
    }
  }
  ngOnInit(): void {}
  filtroRapido(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  filtroRapidoSeguimiento(filterValue: string) {
    this.dataSourceSeguimiento.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceSeguimiento.paginator) {
      this.dataSourceSeguimiento.paginator.firstPage();
    }
  }
  buscarSeguimientosPorAlumno(alumno: IAlumno) {
    this.cargandoSeguimiento = true;
    this.dataSource.data.forEach((x) => (x.selected = false));
    alumno.selected = true;
    this.seguimientos = [];
    this.dataSourceSeguimiento.data = [];
    this.retBuscarSeguimientosPorAlumno.emit(alumno);
  }
  abrirModalDetalle(row: ISeguimientoAlumno) {
    const dialogRef = this.dialog.open(VerSeguimientoModalComponent, {
      data: row,
      width: '60%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }
}
