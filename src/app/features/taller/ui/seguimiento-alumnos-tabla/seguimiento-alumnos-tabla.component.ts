import { trigger, state, style, transition, animate } from '@angular/animations';
import { MediaMatcher, BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';
import { designAnimations } from '@design/animations';
import { ISeguimientoAlumno } from 'app/models/interface/iSeguimientoAlumno';
import * as moment from 'moment';

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
  @Output() retEditar = new EventEmitter<ISeguimientoAlumno>();
  @Output() retEliminar = new EventEmitter<ISeguimientoAlumno>();
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
  // Mobile
  isMobile: boolean;
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  constructor(
    private _router: Router,
    private _changeDetectorRef: ChangeDetectorRef,
    private _media: MediaMatcher,
    public breakpointObserver: BreakpointObserver
  ) {
   
    this.mobileQuery = this._media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this._changeDetectorRef.detectChanges();
    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.HandsetPortrait]).subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.isMobile = true;
        this.columnas = ['alumno', 'fecha', 'resuelto', 'opciones'];
      } else {
        this.isMobile = false;
        this.columnas = ['seguimientoAlumnoNro', 'alumno', 'fecha', 'cicloLectivo', 'resuelto', 'opciones'];
      }
    });
  }

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
      const columns: any[] = [
        data.resuelto ? 'RESUELTO' : 'SIN RESOLVER',
        data.alumno.nombreCompleto,
        moment.utc(data.fecha, 'YYYY-MM-DD').format('DD/MM/YYYY').toString(), // 2021-03-02T15:21:12
      ];
      if (!this.isMobile) {
        columns.push(data.seguimientoAlumnoNro ? data.seguimientoAlumnoNro : '');
        columns.push(data.cicloLectivo.anio);
      }

      filterArray.forEach((filter) => {
        const customFilter = [];
        columns.forEach((column) => customFilter.push(column.toString().toLowerCase().includes(filter)));
        matchFilter.push(customFilter.some(Boolean)); // OR
      });
      return matchFilter.every(Boolean); // AND
    };
    // Personalizar Sort
    this.dataSource.sortingDataAccessor = (item: ISeguimientoAlumno, property) => {
      switch (property) {
        // case 'seguimientoAlumnoNro':
        //   return item.seguimientoAlumnoNro ;
        case 'fecha':
          return item.fecha ? new Date(item.fecha) : '';
        case 'alumno':
          return item.alumno.nombreCompleto;
        case 'resuelto':
          return item.resuelto ? 'SI' : 'NO';
        default:
          return item[property];
      }
    };
  }
  editar(row: ISeguimientoAlumno) {
    this._router.navigate([`taller/seguimiento-edicion-single/${row._id}`]);
  }
  eliminar(row: ISeguimientoAlumno) {
    this.retEliminar.emit(row);
  }
  redireccionarPlanilla(row: ISeguimientoAlumno) {
    if (row.planillaTaller) {
      this._router.navigate([`taller/planilla-ver/${row.planillaTaller._id}/${row.cicloLectivo.anio}`]);
    }
  }
}
