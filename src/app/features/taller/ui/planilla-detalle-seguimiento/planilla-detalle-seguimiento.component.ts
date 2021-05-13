import { MediaMatcher, Breakpoints, BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { designAnimations } from '@design/animations';
import { IAlumno } from 'app/models/interface/iAlumno';
import { ICicloLectivo } from 'app/models/interface/iCicloLectivo';
import { ISeguimientoAlumno } from 'app/models/interface/iSeguimientoAlumno';
import { ITema } from 'app/models/interface/iTema';
import { CONFIG_PROVIDER } from 'app/shared/config.provider';
import { VerSeguimientoModalComponent } from '../ver-seguimiento-modal/ver-seguimiento-modal.component';

@Component({
  selector: 'app-planilla-detalle-seguimiento',
  templateUrl: './planilla-detalle-seguimiento.component.html',
  styleUrls: ['./planilla-detalle-seguimiento.component.scss'],
  animations: [designAnimations],
  providers: CONFIG_PROVIDER, // Para el time
})
export class PlanillaDetalleSeguimientoComponent implements OnInit, OnChanges {
  @Input() template: string;
  @Input() cargandoAlumnos: boolean;
  @Input() alumnos: IAlumno[];
  @Input() seguimientos: ISeguimientoAlumno[];
  @Input() cicloLectivo?: ICicloLectivo; // DEBERIA USAR EL CICLO LECTIVO DEL SEGUIMIENTO
  @Input() cargandoSeguimiento: boolean;
  @Input() deshabilitarEdicion?: boolean;
  @Output() retBuscarSeguimientosPorAlumno = new EventEmitter<IAlumno>();
  @Output() retEliminarSeguimiento = new EventEmitter<ISeguimientoAlumno>();
  @Output() retEditarSeguimiento = new EventEmitter<ISeguimientoAlumno>();
  @Output() retAbrirModalSeguimiento = new EventEmitter<boolean>();
  //   Alumnos
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild('sort') set setSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild('paginator') set setPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  columnas = ['nombreCompleto', 'seguimientoEtap'];
  //   Seguimientoes
  dataSourceSeguimiento: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild('sortSeguimiento') set setSortSeguimiento(sort: MatSort) {
    this.dataSourceSeguimiento.sort = sort;
  }
  @ViewChild('paginatorSeguimiento') set setPaginatorSeguimiento(paginator: MatPaginator) {
    this.dataSourceSeguimiento.paginator = paginator;
  }
  columnasSeguimiento = [];
  // Mobile
  expandedElement: ITema | null;
  isMobile: boolean;
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  //

  constructor(
    public dialog: MatDialog,
    private _changeDetectorRef: ChangeDetectorRef,
    private _media: MediaMatcher,
    public breakpointObserver: BreakpointObserver
  ) {
    this.mobileQuery = this._media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this._changeDetectorRef.detectChanges();
    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.HandsetPortrait]).subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.isMobile = true;
        this.columnasSeguimiento = ['fecha', 'tipoSeguimiento', 'resuelto', 'opciones'];
      } else {
        this.isMobile = false;
        this.columnasSeguimiento = ['fecha', 'tipoSeguimiento', 'resuelto', 'opciones'];
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.alumnos && changes.alumnos.currentValue) {
      this.dataSource.data = this.alumnos;
    }
    if (changes.template && changes.template.currentValue) {
    }
    if (changes.seguimientos && changes.seguimientos.currentValue) {
      this.dataSourceSeguimiento.data = this.seguimientos;
    }
  }
  ngOnInit(): void {}

  filtroRapido(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  filtroRapidoSeguimiento(filterValue: string) {
    this.dataSourceSeguimiento.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceSeguimiento.paginator) {
      this.dataSourceSeguimiento.paginator.firstPage();
    }
  }
  buscarSeguimientosPorAlumno(alumno: IAlumno) {
    this.cargandoSeguimiento = true;
    this.dataSource.data.forEach((x) => (x.selected = false));
    alumno.selected = true;
    this.seguimientos = [];
    this.dataSourceSeguimiento.data = [];
    this.retBuscarSeguimientosPorAlumno.emit(alumno);
  }
  abrirModalDetalle(row: ISeguimientoAlumno) {
    row.cicloLectivo = this.cicloLectivo;
    const dialogRef = this.dialog.open(VerSeguimientoModalComponent, {
      data: row,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }
  eliminar(seguimiento: ISeguimientoAlumno) {
    this.retEliminarSeguimiento.emit(seguimiento);
  }
  editar(seguimiento: ISeguimientoAlumno) {
    this.retEditarSeguimiento.emit(seguimiento);
  }
  mostrarModal() {
    this.retAbrirModalSeguimiento.emit(true);
  }
}
