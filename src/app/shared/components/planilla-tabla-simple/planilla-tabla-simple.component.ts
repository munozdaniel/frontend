import { trigger, state, style, transition, animate } from '@angular/animations';
import { MediaMatcher, BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { designAnimations } from '@design/animations';
import { UntilDestroy } from '@ngneat/until-destroy';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import * as moment from 'moment';
@UntilDestroy()
@Component({
  selector: 'app-planilla-tabla-simple',
  templateUrl: './planilla-tabla-simple.component.html',
  styleUrls: ['./planilla-tabla-simple.component.scss'],
  animations: [
    designAnimations,
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PlanillaTablaSimpleComponent implements OnInit, OnChanges {
  @Input() cargando: boolean;
  @Input() planillas: IPlanillaTaller[];
  @Output() retInformeAsistenciasPorTaller = new EventEmitter<IPlanillaTaller>();
  @Output() retInformeAsistenciasPorDia = new EventEmitter<IPlanillaTaller>();
  @Output() retInformeCalificacionesPorTaller = new EventEmitter<IPlanillaTaller>();
  @Output() retInformeCalificacionesPorTallerResumido = new EventEmitter<IPlanillaTaller>();
  @Output() retInformeLibroTemas = new EventEmitter<IPlanillaTaller>();
  @Output() retInformeAlumnosPorTaller = new EventEmitter<IPlanillaTaller>();
  @Output() retInformeTallerPorAlumnos = new EventEmitter<IPlanillaTaller>();
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild('sort') set setSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild('paginator') set setPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  columnas = ['planillaTallerNro', 'fechaInicio', 'fechaFinalizacion', 'bimestre', 'asignatura', 'profesor', 'observacion', 'opciones'];
  expandedElement: IPlanillaTaller | null;
  // Mobile
  isMobile: boolean;
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  constructor(private _changeDetectorRef: ChangeDetectorRef, private _media: MediaMatcher, public breakpointObserver: BreakpointObserver) {
    this.mobileQuery = this._media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this._changeDetectorRef.detectChanges();
    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.HandsetPortrait]).subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.isMobile = true;
        this.columnas = ['asignatura', 'bimestre', 'opciones'];
      } else {
        this.isMobile = false;
        this.columnas = [
          'planillaTallerNro',
          'fechaInicio',
          'fechaFinalizacion',
          'bimestre',
          'asignatura',
          'profesor',
          'observacion',
          'opciones',
        ];
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.planillas && changes.planillas.currentValue) {
      this.dataSource.data = this.planillas;
    }
  }

  ngOnInit(): void {
    this.customSearchSortTable();
  }
  customSearchSortTable() {
    // Personalizar funcion busqueda en la tabla detalle
    this.dataSource.filterPredicate = (data: IPlanillaTaller, filters: string) => {
      const matchFilter = [];
      const filterArray = filters.split(',');
      const columns = [
        data.planillaTallerNro,
        moment.utc(data.fechaInicio, 'YYYY-MM-DDTHH:mm:ss').format('DD/MM/YYYY HH:mm:ss').toString(), // 2021-03-02T15:21:12
        data.bimestre,
        data.asignatura.detalle,
        '0' + data.curso.curso + ' / 0' + data.curso.division + ' / ' + data.curso.comision,
        data.profesor.nombreCompleto,
        data.observacion,
        data.cicloLectivo.anio,
      ];

      filterArray.forEach((filter) => {
        const customFilter = [];
        columns.forEach((column) => {
          if (column) {
            customFilter.push(column.toString().toLowerCase().includes(filter));
          }
        });
        matchFilter.push(customFilter.some(Boolean)); // OR
      });
      return matchFilter.every(Boolean); // AND
    };
    // Personalizar Sort
    //     planillaTallerNro
    // cicloLectivo
    // fechaInicio
    // bimestre
    // asignatura
    // comisioncompleta
    // profesor
    // observacion
    // opciones
    this.dataSource.sortingDataAccessor = (item: IPlanillaTaller, property) => {
      switch (property) {
        case 'planillaTallerNro':
          return item.planillaTallerNro.toString();
        case 'cicloLectivo':
          return item.cicloLectivo[0].anio;
        case 'fechaInicio':
          return moment.utc(item.fechaInicio, 'YYYY-MM-DDTHH:mm:ss').format('DD/MM/YYYY HH:mm:ss').toString();
        case 'asignatura':
          return item.asignatura.detalle;
        case 'comisioncompleta':
          return '0' + item.curso.curso + ' / 0' + item.curso.division + ' / ' + item.curso.comision;
        case 'profesor':
          return item.profesor.nombreCompleto;
        default:
          return item[property];
      }
    };
  }
  filtroRapido(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  reporteAsistenciasPorTaller(planilla: IPlanillaTaller) {
    this.retInformeAsistenciasPorTaller.emit(planilla);
  }
  reporteAsistenciasPorDia(planilla: IPlanillaTaller) {
    this.retInformeAsistenciasPorDia.emit(planilla);
  }
  reporteCalificacionesPorTaller(planilla: IPlanillaTaller) {
    this.retInformeCalificacionesPorTaller.emit(planilla);
  }
  reporteCalificacionesPorTallerResumido(planilla: IPlanillaTaller) {
    this.retInformeCalificacionesPorTallerResumido.emit(planilla);
  }
  reporteLibroTemas(planilla: IPlanillaTaller) {
    this.retInformeLibroTemas.emit(planilla);
  }
  reporteAlumnosPorTaller(planilla: IPlanillaTaller) {
    this.retInformeAlumnosPorTaller.emit(planilla);
  }
  reporteTallerPorAlumnos(planilla: IPlanillaTaller) {
    this.retInformeTallerPorAlumnos.emit(planilla);
  }
}
