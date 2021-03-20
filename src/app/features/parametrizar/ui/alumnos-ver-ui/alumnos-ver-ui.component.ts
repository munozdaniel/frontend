import { MediaMatcher, BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { IAlumno } from 'app/models/interface/iAlumno';
import { IEstadoCursada } from 'app/models/interface/iEstadoCursada';

@Component({
  selector: 'app-alumnos-ver-ui',
  templateUrl: './alumnos-ver-ui.component.html',
  styleUrls: ['./alumnos-ver-ui.component.scss'],
})
export class AlumnosVerUiComponent implements OnInit, OnChanges {
  @Input() alumno: IAlumno;
  @Input() cargando: boolean;
  //   Cursadas
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild('sort') set setSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild('paginator') set setPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  columnas = ['cicloLectivo', 'curso', 'division', 'comision', 'condicion'];
  estadoCursadas: IEstadoCursada[];
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
        this.columnas = ['cicloLectivo', 'curso', 'condicion'];
      } else {
        this.isMobile = false;
        this.columnas = ['cicloLectivo', 'curso', 'division', 'comision', 'condicion'];
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.alumno && changes.alumno.currentValue) {
      this.dataSource.data = this.estadoCursadas = this.alumno.estadoCursadas;
    }
  }

  ngOnInit(): void {}
}
