import { Component, Inject, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatPaginator, MatSort, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { designAnimations } from '@design/animations';

@Component({
  selector: 'app-resultado-ciclo-tabla',
  templateUrl: './resultado-ciclo-tabla.component.html',
  styleUrls: ['./resultado-ciclo-tabla.component.scss'],
  animations: [designAnimations],
})
export class ResultadoCicloTablaComponent implements OnInit {
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild('sort') set setSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild('paginator') set setPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  columnas = ['nombreCompleto'];
  //
  dataSourceNo: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild('sortNo') set setSortNo(sort: MatSort) {
    this.dataSourceNo.sort = sort;
  }
  @ViewChild('paginatorNo') set setPaginatorNo(paginator: MatPaginator) {
    this.dataSourceNo.paginator = paginator;
  }
  columnasNo = ['nombreCompleto'];
  //
  alumnos: any[];
  ultimosNoActualizados: any[];
  constructor(public dialogRef: MatDialogRef<ResultadoCicloTablaComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.dataSource.data = this.alumnos = data.ultimosActualizados;
    this.dataSourceNo.data = this.ultimosNoActualizados = data.ultimosNoActualizados;
  }
  ngOnInit(): void {}

  filtroRapido(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  filtroRapidoNo(filterValue: string) {
    this.dataSourceNo.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceNo.paginator) {
      this.dataSourceNo.paginator.firstPage();
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
