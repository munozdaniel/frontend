import { MediaMatcher, BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';
import { designAnimations } from '@design/animations';
import { FichaAlumnoPdf } from 'app/core/services/pdf/ficha-alumno.pdf';
import { ALUMNO_OPERACION } from 'app/models/constants/alumno-operacion.enum';
import { IAlumno } from 'app/models/interface/iAlumno';
import { IPaginado } from 'app/models/interface/iPaginado';

@Component({
  selector: 'app-alumnos-tabla-param',
  templateUrl: './alumnos-tabla-param.component.html',
  styleUrls: ['./alumnos-tabla-param.component.scss'],
  animations: designAnimations,
})
export class AlumnosTablaParamComponent implements OnInit, OnChanges {
  alumnoOperacion = ALUMNO_OPERACION;
  @Input() operacion: ALUMNO_OPERACION;
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
  // Mobile
  isMobile: boolean;
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  constructor(
    private _fichaAlumnoPdf: FichaAlumnoPdf,
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

  ngOnInit(): void {}
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
  //   editar(row: IAlumno) {
  //     this._router.navigate(['/parametrizar/alumnos-editar/' + row._id]);
  //   }
  //   ver(row: IAlumno) {
  //     this._router.navigate(['/parametrizar/alumnos-ver/' + row._id]);
  //   }

  verFichaPersonalAlumno(alumno: IAlumno) {
    this._fichaAlumnoPdf.generatePdf(alumno);
  }
  verSeguimientoAlumno(alumno: IAlumno) {
    this._router.navigate([`/taller/seguimiento-alumno-single/${alumno._id}`]);
  }
}
