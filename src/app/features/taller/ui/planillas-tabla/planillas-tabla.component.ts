import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Output,
  ViewChild,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
} from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, PageEvent } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { designAnimations } from '@design/animations';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
@Component({
  selector: 'app-planillas-tabla',
  templateUrl: './planillas-tabla.component.html',
  styleUrls: ['./planillas-tabla.component.scss'],
  animations: [designAnimations],
})
export class PlanillasTablaComponent implements OnInit, OnChanges {
  @Input() planillas: IPlanillaTaller[];
  @Input() cargando: boolean;
  columnas = [
    'planillaTallerNro',
    'cicloLectivo',
    'fechaInicio',
    'bimestre',
    'asignatura',
    // 'curso',
    // 'div',
    // 'comision',
    'comisioncompleta',
    'duracion',
    'profesor',
    'observacion',
    'opciones',
  ];

  planillaTaller: IPlanillaTaller;
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild('sort') set setSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild('paginator') set setPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  total = 0;
  pageSize = 5;
  constructor(private route: ActivatedRoute) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.planillas && changes.planillas.currentValue) {
      console.log('ENTRA ', this.planillas);
      this.dataSource.data = this.planillas;
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
