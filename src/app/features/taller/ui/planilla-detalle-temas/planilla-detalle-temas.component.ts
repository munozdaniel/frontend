import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { designAnimations } from '@design/animations';
import { ITema } from 'app/models/interface/iTema';

@Component({
  selector: 'app-planilla-detalle-temas',
  templateUrl: './planilla-detalle-temas.component.html',
  styleUrls: ['./planilla-detalle-temas.component.scss'],
  animations: [designAnimations],
})
export class PlanillaDetalleTemasComponent implements OnInit, OnChanges {
  @Input() temas: ITema[];
  @Input() cargandoTemas: boolean;

  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild('sort') set setSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild('paginator') set setPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  columnas = ['fecha', 'nroClase', 'unidad', 'caracterClase', 'temaDelDia', 'temasProximaClase'];
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.temas && changes.temas.currentValue) {
      this.dataSource.data = this.temas;
    }
  }

  ngOnInit(): void {}
  filtroRapido(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
