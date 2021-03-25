import { MediaMatcher, BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { IAlumno } from 'app/models/interface/iAlumno';

@Component({
  selector: 'app-alumnos-tabla-asistencias',
  templateUrl: './alumnos-tabla-asistencias.component.html',
  styleUrls: ['./alumnos-tabla-asistencias.component.scss'],
})
export class AlumnosTablaAsistenciasComponent implements OnInit, OnChanges {
  @Input() cargando: boolean;
  @Input() alumnos: IAlumno[];
  // ALUMNOS ________________________________
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild('sort') set setSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild('paginator') set setPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  columnas: string[] = ['alumnoNro', 'nombre', 'email', 'dni', 'seguimientoEtap', 'opciones'];

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
        this.columnas = ['nombre', 'opciones'];
      } else {
        this.isMobile = false;
        this.columnas = ['alumnoNro', 'nombre', 'email', 'dni', 'seguimientoEtap', 'opciones'];
      }
    });
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
  ngOnInit(): void {}

  setPresente(alumno: IAlumno) {}
  setLlegoTarde(alumno: IAlumno) {}
}
