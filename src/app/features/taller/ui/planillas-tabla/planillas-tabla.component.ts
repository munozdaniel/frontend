import { trigger, state, style, transition, animate } from '@angular/animations';
import { BreakpointObserver, Breakpoints, BreakpointState, MediaMatcher } from '@angular/cdk/layout';
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource, MatSort, MatPaginator, PageEvent } from '@angular/material';
import { Router } from '@angular/router';
import { designAnimations } from '@design/animations';
import { PlanillaTallerService } from 'app/core/services/planillaTaller.service';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import { IPlanillaTallerParam } from 'app/models/interface/iPlanillaTallerParams';
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
export class PlanillasTablaComponent implements OnInit, OnChanges, OnDestroy {
  globalFilter = '';

  cursoFilter = new FormControl();
  divisionFilter = new FormControl();
  turnoFilter = new FormControl();
  bimestreFilter = new FormControl();
  filteredValues = {
    curso: null,
    division: null,
    bimestre: '',
    turno: '',
    multiple: true,
    general: '',
  };
  @Input() planillaParams: IPlanillaTallerParam;
  @Output() retPlanillaParams = new EventEmitter<IPlanillaTallerParam>();
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
    public breakpointObserver: BreakpointObserver,
    private _planillaTallerService: PlanillaTallerService
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
  ngOnDestroy(): void {
    // this.salvarDatos();
    this.retPlanillaParams.emit(this.planillaParams);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.planillaParams && changes.planillaParams.currentValue) {
      if (this.dataSource.data.length > 0) {
        this.setFiltros();
      }
    }

    if (changes.planillas && changes.planillas.currentValue) {
      this.dataSource.data = this.planillas;
      //   this.dataSource.filterPredicate = this.customFilterPredicate();
      this.customSearchSortTable();
      this.setFiltros();
    }
  }
  setFiltros() {
    if (this.planillaParams.curso) {
      this.cursoFilter.setValue(this.planillaParams.curso);
    }
    if (this.planillaParams.division) {
      this.divisionFilter.setValue(this.planillaParams.division);
    }
    if (this.planillaParams.turno) {
      this.turnoFilter.setValue(this.planillaParams.turno);
    }
    if (this.planillaParams.bimestre) {
      this.bimestreFilter.setValue(this.planillaParams.bimestre);
    }
  }
  ngOnInit(): void {
    this.cursoFilter.valueChanges.subscribe((valor) => {
      this.filteredValues['curso'] = valor;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.planillaParams.curso = valor;
      //   this.planillaParams.curso = cursoFilterValue;
      //   this._planillaTallerService.setPlanillaParams(this.planillaParams);
    });

    this.divisionFilter.valueChanges.subscribe((valor) => {
      this.filteredValues['division'] = valor;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      //   this.planillaParams.division = divisionFilterValue;
      //   this._planillaTallerService.setPlanillaParams(this.planillaParams);
      this.planillaParams.division = valor;
    });

    this.turnoFilter.valueChanges.subscribe((valor) => {
      this.filteredValues['turno'] = valor;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      //   this.planillaParams.turno = positionFilterValue;
      //   this._planillaTallerService.setPlanillaParams(this.planillaParams);
      this.planillaParams.turno = valor;
    });

    this.bimestreFilter.valueChanges.subscribe((valor) => {
      this.filteredValues['bimestre'] = valor;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      //   this.planillaParams.bimestre = nameFilterValue;
      //   this._planillaTallerService.setPlanillaParams(this.planillaParams);
      this.planillaParams.bimestre = valor;
    });
  }

  filtroRapido(filterValue: string) {
    // this.planillaParams.filtro = filterValue;
    // this._planillaTallerService.setPlanillaParams(this.planillaParams);

    this.filteredValues.general = filterValue;
    this.dataSource.filter = JSON.stringify(this.filteredValues);

    // this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  customSearchSortTable() {
    // Personalizar funcion busqueda en la tabla detalle
    this.dataSource.filterPredicate = (data: IPlanillaTaller, filters: string | any) => {
      let filterArray = [];
      const filtrosObject = JSON.parse(filters);
      if (filtrosObject.curso !== '' && filtrosObject.curso !== null) {
        filterArray.push(filtrosObject.curso);
      }

      if (filtrosObject.division !== '' && filtrosObject.division !== null) {
        filterArray.push(filtrosObject.division.toLowerCase());
      }
      if (filtrosObject.bimestre !== '') {
        filterArray.push(filtrosObject.bimestre.toLowerCase());
      }
      if (filtrosObject.turno !== '') {
        filterArray.push(filtrosObject.turno.toLowerCase());
      }
      if (filtrosObject.general !== '') {
        filterArray = [...filterArray, ...filtrosObject.general.split(',')];
      }

      const matchFilter = [];
      //   const filterArray = filters.split(',');
      const columns = [
        data.turno,
        data.planillaTallerNro,
        moment.utc(data.fechaInicio, 'YYYY-MM-DDTHH:mm:ss').format('DD/MM/YYYY HH:mm:ss').toString(), // 2021-03-02T15:21:12
        data.bimestre,
        data.asignatura.detalle,
        data.profesor.nombreCompleto,
        data.observacion,
        data.cicloLectivo.anio,
      ];
      if (data.curso) {
        // columns.push(data.curso.curso + '° AÑO ' + data.curso.division + '° DIV COM. ' + data.curso.comision);
        columns.push(Number(data.curso.curso) + '° AÑO');
        columns.push(data.curso.division.toString() + '° DIV.');
      }

      filterArray.forEach((filter) => {
        const customFilter = [];
        columns.forEach((column) => {
          if (column) {
            // console.log('column', column);
            customFilter.push(
              column
                .toString()
                .toLowerCase()
                .includes(filter ? filter.toString().toLowerCase() : '')
            );
          }
        });
        matchFilter.push(customFilter.some(Boolean)); // OR
      });
      //   }
      return matchFilter.every(Boolean); // AND
      //   }
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
          return item.turno ? item.turno.toString().toLowerCase() : '';
        case 'cicloLectivo':
          return item.cicloLectivo.anio;
        case 'fechaInicio':
          return moment.utc(item.fechaInicio, 'YYYY-MM-DDTHH:mm:ss').format('DD/MM/YYYY HH:mm:ss').toString();
        case 'asignatura':
          return item.asignatura.detalle ? item.asignatura.detalle.toString().toLowerCase() : '';
        case 'bimestre':
          return item.bimestre ? item.bimestre.toString().toLowerCase() : '';
        case 'comisioncompleta':
          return item.curso ? item.curso.curso + '° AÑO ' + item.curso.division + '° DIV COM. ' + item.curso.comision : '';
        case 'profesor':
          return item.profesor.nombreCompleto ? item.profesor.nombreCompleto.toLowerCase() : '';
        default:
          return item[property];
      }
    };
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
