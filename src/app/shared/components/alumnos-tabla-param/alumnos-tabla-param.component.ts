import { MediaMatcher, BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FichaAlumnoPdf } from 'app/core/services/pdf/ficha-alumno.pdf';
import { SeguimientoAlumnoPdf } from 'app/core/services/pdf/seguimiento-alumno.pdf';
import { SeguimientoAlumnoService } from 'app/core/services/seguimientoAlumno.service';
import { IAlumno } from 'app/models/interface/iAlumno';
@UntilDestroy()
@Component({
  selector: 'app-alumnos-tabla-param',
  templateUrl: './alumnos-tabla-param.component.html',
  styleUrls: ['./alumnos-tabla-param.component.scss'],
  animations: designAnimations,
})
export class AlumnosTablaParamComponent implements OnInit, OnChanges {
  @Input() cargando: boolean;
  // ALUMNOS ________________________________
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild('sort') set setSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild('paginator') set setPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  columnas: string[] = ['alumnoNro', 'nombre', 'email', 'dni', 'seguimientoEtap', 'opciones'];
  // Input
  @Input() alumnos: IAlumno[];
  @Output() retEliminarAlumno = new EventEmitter<IAlumno>();
  @Output() retInformePromediosPorTaller = new EventEmitter<IAlumno>();
  // Mobile
  isMobile: boolean;
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  constructor(
    private _seguimientoService: SeguimientoAlumnoService,
    private _fichaAlumnoPdf: FichaAlumnoPdf,
    private _seguimientoAlumnoPdf: SeguimientoAlumnoPdf,
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
        this.columnas = ['nombre', 'seguimientoEtap', 'opciones'];
      } else {
        this.isMobile = false;
        this.columnas = ['alumnoNro', 'nombre', 'email', 'dni', 'seguimientoEtap', 'opciones'];
      }
    });
  }

  ngOnInit(): void {
    this.customSearchSortTable();
  }
  customSearchSortTable() {
    // Personalizar funcion busqueda en la tabla detalle
    this.dataSource.filterPredicate = (data: IAlumno, filters: string) => {
      const matchFilter = [];
      const filterArray = filters.split(',');
      const columns = [data.alumnoNro, data.nombreCompleto, data.email, data.dni, data.seguimientoEtap ? 'SI' : 'NO'];

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

    this.dataSource.sortingDataAccessor = (item: IAlumno, property) => {
      switch (property) {
        case 'alumnoNro':
          return item.alumnoNro.toString();
        case 'nombre':
          return item.nombreCompleto;
        case 'email':
          return item.email;
        case 'dni':
          return item.dni;

        default:
          return item[property];
      }
    };
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.alumnos && changes.alumnos.currentValue) {
      this.dataSource.data = changes.alumnos.currentValue;
    }
  }
  filtroRapido(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  editar(row: IAlumno) {
    this._router.navigate(['/parametrizar/alumnos-editar/' + row._id]);
  }
  ver(row: IAlumno) {
    this._router.navigate(['/parametrizar/alumnos-ver/' + row._id]);
  }

  verFichaPersonalAlumno(alumno: IAlumno) {
    this._fichaAlumnoPdf.generatePdf(alumno);
  }
  verSeguimientoAlumno(alumno: IAlumno) {
    // obtener seguimiento por alumno
    this._seguimientoService
      .obtenerPorAlumno(alumno._id)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this._seguimientoAlumnoPdf.generatePdf(alumno, datos);
        },
        (error) => {
          console.log('[ERROR]', error);
        }
      );
  }
  eliminarAlumno(alumno: IAlumno) {
    this.retEliminarAlumno.emit(alumno);
  }
  buscarInformePromedios(alumno: IAlumno) {
    this.retInformePromediosPorTaller.emit(alumno);
  }
}
