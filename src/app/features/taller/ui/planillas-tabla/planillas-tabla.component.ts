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
import { PlanillaTallerDataSource } from 'app/core/services/paginacion/planilla-taller.datasource';
import { IPaginado } from 'app/models/interface/iPaginado';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import { merge, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, first, tap } from 'rxjs/operators';
@Component({
  selector: 'app-planillas-tabla',
  templateUrl: './planillas-tabla.component.html',
  styleUrls: ['./planillas-tabla.component.scss'],
  animations: [designAnimations],
})
export class PlanillasTablaComponent implements AfterViewInit, OnInit, OnChanges {
  @Input() cargando: boolean;
  @Output() retPaginacion = new EventEmitter<IPaginado>();
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
  @Input() dataSource: PlanillaTallerDataSource;
  planillaTaller: IPlanillaTaller;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;
  total = 0;
  constructor(private route: ActivatedRoute) {}
  ngAfterViewInit() {
    // server-side search
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 1;
          this.cargarDatos();
        })
      )
      .subscribe();
    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 1));
    //
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.cargarDatos()))
      .subscribe();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataSource && changes.dataSource.currentValue) {
      console.log('ENTRA ');
      this.dataSource.total$.subscribe((datos) => (this.total = datos));
    }
  }

  ngOnInit(): void {}
  cargarDatos() {
    console.log('this.sort.direction', this.sort);
    const campo = this.sort.active;
    this.retPaginacion.emit({
      search: this.input.nativeElement.value,
      sortField: campo,
      sortBy: this.sort.direction,
      currentPage: this.paginator.pageIndex + 1,
      pageSize: this.paginator.pageSize,
    });
  }
  
}
