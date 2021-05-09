import { MediaMatcher, BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { designAnimations } from '@design/animations';
import { IAlumno } from 'app/models/interface/iAlumno';
import { IAsistencia } from 'app/models/interface/iAsistencia';
import { CONFIG_PROVIDER } from 'app/shared/config.provider';
import * as moment from 'moment';
import { defaultThrottleConfig } from 'rxjs/internal/operators/throttle';

@Component({
  selector: 'app-administrar-asistencias',
  templateUrl: './administrar-asistencias.component.html',
  styleUrls: ['./administrar-asistencias.component.scss'],
  animations: [designAnimations],
  providers: CONFIG_PROVIDER, // Para el time
})
export class AdministrarAsistenciasComponent implements OnInit, OnChanges {
  @Input() cargandoAsistencias: boolean;
  @Input() cargandoAlumnos: boolean;
  @Input() alumnos: IAlumno[] & IAsistencia[];
  @Input() asistencias: IAsistencia[];
  //   Output
  @Output() retAlumnoPresente = new EventEmitter<boolean>();
  @Output() retAlumnoTarde = new EventEmitter<boolean>();
  //   Alumnos
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild('sort') set setSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild('paginator') set setPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  columnas = ['nombreCompleto'];
  form: FormGroup;
  // Mobile
  isMobile: boolean;
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  constructor(
    private _fb: FormBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
    private _media: MediaMatcher,
    public breakpointObserver: BreakpointObserver
  ) {
    this.mobileQuery = this._media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this._changeDetectorRef.detectChanges();
    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.HandsetPortrait]).subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.isMobile = true;
        this.columnas = ['nombreCompleto'];
      } else {
        this.isMobile = false;
        this.columnas = ['nombreCompleto', 'presente', 'ausente', 'tarde'];
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.alumnos && changes.alumnos.currentValue) {
      this.dataSource.data = this.alumnos;
    }
  }

  ngOnInit(): void {
    this.form = this._fb.group({
      fecha: [moment().format('YYYY-MM-DD HH:mm:ss'), Validators.required],
    });
  }
  filtroRapido(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  alumnoPresente(asistenciaAlumno:IAsistencia) {}
  alumnoAusente(asistenciaAlumno:IAsistencia) {}
  alumnoTarde(asistenciaAlumno:IAsistencia) {}
}
