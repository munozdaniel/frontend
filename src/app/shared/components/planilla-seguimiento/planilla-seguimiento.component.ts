import { trigger, state, style, transition, animate } from '@angular/animations';
import { MediaMatcher, BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { designAnimations } from '@design/animations';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import * as moment from 'moment';
// Para buscar las planillas en el seguimiento
@Component({
  selector: 'app-planilla-seguimiento',
  templateUrl: './planilla-seguimiento.component.html',
  styleUrls: ['./planilla-seguimiento.component.scss'],
  animations: [
    designAnimations,
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PlanillaSeguimientoComponent implements OnInit, OnChanges {
  columnas = ['asignatura', 'comisioncompleta', 'opciones'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild('sort') set setSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild('paginator') set setPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  globalFilter = '';

  turnoFilter = new FormControl();
  bimestreFilter = new FormControl();
  filteredValues = {
    bimestre: '',
    turno: '',
    multiple: true,
    general: '',
  };
  @Input() planillas: IPlanillaTaller[];
  @Input() cargando: boolean;
  @Output() retPlanilla = new EventEmitter<IPlanillaTaller>();
  // Mobile
  isMobile: boolean;
  private _mobileQueryListener: () => void;
  constructor(private _changeDetectorRef: ChangeDetectorRef, private _media: MediaMatcher, public breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.HandsetPortrait]).subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.planillas && changes.planillas.currentValue) {
      this.dataSource.data = this.planillas;
      this.customSearchSortTable();
      this.turnoFilter.valueChanges.subscribe((positionFilterValue) => {
        this.filteredValues['turno'] = positionFilterValue;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
      });

      this.bimestreFilter.valueChanges.subscribe((nameFilterValue) => {
        this.filteredValues['bimestre'] = nameFilterValue;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
      });
    }
  }

  ngOnInit(): void {}
  filtroRapido(filterValue: string) {
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
        columns.push(data.curso.curso + '° AÑO ' + data.curso.division + '° DIV COM. ' + data.curso.comision);
      }

      filterArray.forEach((filter) => {
        const customFilter = [];
        columns.forEach((column) => {
          if (column) {
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
          return item.curso.curso + '° AÑO ' + item.curso.division + '° DIV COM. ' + item.curso.comision;
        case 'profesor':
          return item.profesor.nombreCompleto ? item.profesor.nombreCompleto.toLowerCase() : '';
        default:
          return item[property];
      }
    };
  }
  seleccionarPlanilla(planilla: IPlanillaTaller) {
    this.dataSource.data.forEach((x) => {
      if (x._id === planilla._id) {
        x.selected = true;
      } else {
        x.selected = false;
      }
    });
    this.retPlanilla.emit(planilla);
  }
}
