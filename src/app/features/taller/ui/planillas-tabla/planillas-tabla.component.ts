import { trigger, state, style, transition, animate } from '@angular/animations';
import { BreakpointObserver, Breakpoints, BreakpointState, MediaMatcher } from '@angular/cdk/layout';
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
  ChangeDetectorRef,
} from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, PageEvent } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { designAnimations } from '@design/animations';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
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
      }
    });
  }

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
  editarPlanillaDetalle(planilla: IPlanillaTaller) {
    const anio = (planilla.curso.cicloLectivo as any).anio;
    this._router.navigate([`taller/planilla-editar/${planilla._id}/${anio}`]);
  }
  verPlanillaDetalle(planilla: IPlanillaTaller) {
    const anio = (planilla.curso.cicloLectivo as any).anio;
    this._router.navigate([`taller/planilla-ver/${planilla._id}/${anio}`]);
  }
  tomarAsistencia(planilla: IPlanillaTaller) {
    this._router.navigate([`taller/asistencia/${planilla._id}`]);
  }
  calificarAlumnos(planilla: IPlanillaTaller) {
    this._router.navigate([`taller/calificar/${planilla._id}`]);
  }
  verLibroDeTemas(planilla: IPlanillaTaller) {
    this._router.navigate([`taller/temas/${planilla._id}`]);
  }
  verSeguimientoDeAlumnos(planilla: IPlanillaTaller) {
    this._router.navigate([`taller/seguimiento-alumno/${planilla._id}`]);
  }
  verInformes(planilla: IPlanillaTaller) {
    this._router.navigate([`taller/informes/${planilla._id}`]);
  }
}
