import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { designAnimations } from '@design/animations';
import { ISeguimientoAlumno } from 'app/models/interface/iSeguimientoAlumno';

@Component({
  selector: 'app-seguimiento-alumnos-tabla',
  templateUrl: './seguimiento-alumnos-tabla.component.html',
  styleUrls: ['./seguimiento-alumnos-tabla.component.scss'],
  animations: [
    designAnimations,
    trigger('efectoAparecer', [
      state('active', style({ opacity: 1 })),
      transition(':enter', [style({ opacity: 0 }), animate(400)]),
      transition(':leave', animate(400, style({ opacity: 0 }))),
    ]),
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SeguimientoAlumnosTablaComponent implements OnInit, OnChanges {
  @Input() cargando: boolean;
  @Input() seguimientoAlumnos: ISeguimientoAlumno[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild('sort') set setSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild('paginator') set setPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  columnas: string[] = [
    'seguimientoAlumnoNro',
    'alumno',
    'fecha',
    // 'tipoSeguimiento',
    'cicloLectivo',
    'resuelto',
    // 'observacion',
    // 'observacion2',
    // 'observacionJefe',
    'opciones',
  ];
  expandedElement: any | null;
  _id;
  constructor() {}

  ngOnInit(): void {
    this.personalizarSearchSortDetalle();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.seguimientoAlumnos && changes.seguimientoAlumnos.currentValue) {
      this.dataSource.data = changes.seguimientoAlumnos.currentValue;
    }
  }
  filtroRapido(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  // Personalizar funcion busqueda en la tabla detalle
  personalizarSearchSortDetalle() {
    this.dataSource.filterPredicate = (data: ISeguimientoAlumno, filters: string) => {
      const matchFilter = [];
      const filterArray = filters.split(',');
      const columns = [data.seguimientoAlumnoNro, data.alumno.nombreCompleto, data.fecha, data.cicloLectivo];

      filterArray.forEach((filter) => {
        const customFilter = [];
        columns.forEach((column) => customFilter.push(column.toString().toLowerCase().includes(filter)));
        matchFilter.push(customFilter.some(Boolean)); // OR
      });
      return matchFilter.every(Boolean); // AND
    };
    // Personalizar Sort
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        // case 'seguimientoAlumnoNro':
        //   return item.seguimientoAlumnoNro ;
        case 'fecha':
          return item.fecha ? new Date(item.fecha) : '';

        default:
          return item[property];
      }
    };
  }
}
