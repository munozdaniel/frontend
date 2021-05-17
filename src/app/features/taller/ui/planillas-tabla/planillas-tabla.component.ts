import { trigger, state, style, transition, animate } from '@angular/animations';
import { BreakpointObserver, Breakpoints, BreakpointState, MediaMatcher } from '@angular/cdk/layout';
import { Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, PageEvent } from '@angular/material';
import { Router } from '@angular/router';
import { designAnimations } from '@design/animations';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import * as moment from 'moment';
@Component({
  selector: 'app-planillas-tabla',
  templateUrl: './planillas-tabla.component.html',
  styleUrls: ['./planillas-tabla.component.scss'],
  animations: [
    designAnimations,
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PlanillasTablaComponent implements OnInit, OnChanges {
  @Input() planillas: IPlanillaTaller[];
  @Input() cargando: boolean;
  columnas = [
    'planillaTallerNro',
    'turno',
    'cicloLectivo',
    'fechaInicio',
    'bimestre',
    'asignatura',
    // 'curso',
    // 'div',
    // 'comision',
    'comisioncompleta',
    // 'duracion',
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
  expandedElement: IPlanillaTaller | null;
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
        this.columnas = ['comisioncompleta', 'bimestre', 'asignatura', 'opciones'];
      } else {
        this.isMobile = false;

        this.columnas = [
          'planillaTallerNro',
          'turno',
          'cicloLectivo',
          'fechaInicio',
          'bimestre',
          'asignatura',
          'comisioncompleta',
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
      this.customSearchSortTable();
    }
  }

  ngOnInit(): void {}
  customSearchSortTable() {
    // Personalizar funcion busqueda en la tabla detalle
    this.dataSource.filterPredicate = (data: IPlanillaTaller, filters: string) => {
      const matchFilter = [];
      const filterArray = filters.split(',');
      const columns = [
        data.turno,
        data.planillaTallerNro,
        moment.utc(data.fechaInicio, 'YYYY-MM-DDTHH:mm:ss').format('DD/MM/YYYY HH:mm:ss').toString(), // 2021-03-02T15:21:12
        data.bimestre,
        data.asignatura.detalle,
        data.curso.curso + '° AÑO ' + data.curso.division + '° DIV COM. ' + data.curso.comision,
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
    // 'planillaTallerNro',
    // 'turno',
    // 'cicloLectivo',
    // 'fechaInicio',
    // 'bimestre',
    // 'asignatura',
    // 'comisioncompleta',
    // 'profesor',
    // 'observacion',
    // 'opciones',
    this.dataSource.sortingDataAccessor = (item: IPlanillaTaller, property) => {
      switch (property) {
        case 'planillaTallerNro':
          return item.planillaTallerNro.toString();
        case 'turno':
          return item.turno.toString();
        case 'cicloLectivo':
          return item.cicloLectivo.anio;
        case 'fechaInicio':
          return moment.utc(item.fechaInicio, 'YYYY-MM-DDTHH:mm:ss').format('DD/MM/YYYY HH:mm:ss').toString();
        case 'asignatura':
          return item.asignatura.detalle;
        case 'bimestre':
          return item.bimestre;
        case 'comisioncompleta':
          return item.curso.curso + '° AÑO ' + item.curso.division + '° DIV COM. ' + item.curso.comision;
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

  verPlanillaDetalle(planilla: IPlanillaTaller) {
    const anio = (planilla.cicloLectivo as any).anio;
    this._router.navigate([`taller/planilla-ver/${planilla._id}/${anio}`]);
  }
  editarPlanillaDetalle(planilla: IPlanillaTaller) {
    const anio = (planilla.cicloLectivo as any).anio;
    // http://localhost:4200/taller/planillas-administrar/60452df8acf1374130a1dc77
    this._router.navigate([`taller/planillas-administrar/${planilla._id}`]);
  }
  tomarAsistencia(planilla: IPlanillaTaller) {
    this._router.navigate([`taller/tomar-asistencia/${planilla._id}`]);
  }
  calificarAlumnos(planilla: IPlanillaTaller) {
    this._router.navigate([`taller/planillas-administrar/${planilla._id}/calificaciones`]);
  }
  verLibroDeTemas(planilla: IPlanillaTaller) {
    this._router.navigate([`taller/planillas-administrar/${planilla._id}/temas`]);
  }
  verSeguimientoDeAlumnos(planilla: IPlanillaTaller) {
    this._router.navigate([`taller/planillas-administrar/${planilla._id}/seguimientos`]);
  }
  verInformes(planilla: IPlanillaTaller) {
    this._router.navigate([`taller/planillas-administrar/${planilla._id}/informes`]);
  }
}
