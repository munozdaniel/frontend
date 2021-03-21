import { Component, OnInit, ViewChild, Input, EventEmitter, Output, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

import { SelectionModel } from '@angular/cdk/collections';
import { designAnimations } from '@design/animations';
import { IAlumno } from 'app/models/interface/iAlumno';
import { MediaMatcher, BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
@Component({
  selector: 'app-alumnos-file',
  templateUrl: './alumnos-file.component.html',
  styleUrls: ['./alumnos-file.component.scss'],
  animations: designAnimations,
})
export class AlumnosFileComponent implements OnInit, OnChanges {
  @Input() formulario: FormGroup;
  @Input() alumnos: IAlumno[];
  @Input() cargando: boolean;
  @Input() cantidadEmail: number;
  @Input() cantidadLogin: number;
  @Output() retArchivo = new EventEmitter<any>();
  @Output() retExcelEjemplo = new EventEmitter<boolean>();

  //
  // file
  @ViewChild('uploader', { static: false }) uploader: any;
  formularioArchivo: FormGroup;
  // Tabla
  dataSource: MatTableDataSource<IAlumno> = new MatTableDataSource([]);
  @ViewChild('sort', { static: false }) set setSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild('paginator', { static: false }) set setPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  columnas: string[] = ['settings', 'legajo', 'nombreCompleto', 'tipoDni', 'dni', 'estado'];
  seleccion = new SelectionModel<any>(true, []);
  alumnosFallados: IAlumno[] = [];
  @Output() retAlumnosFallados = new EventEmitter<IAlumno[]>();
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
        this.columnas = ['settings', 'nombreLegajo', 'documento', 'estado'];
      } else {
        this.isMobile = false;
        this.columnas = ['settings', 'legajo', 'nombreCompleto', 'tipoDni', 'dni', 'estado'];
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.alumnos && changes.alumnos.currentValue) {
      this.dataSource.data = changes.alumnos.currentValue;
      this.marcarTabla();
    }
  }

  ngOnInit() {
    this.formularioArchivo = this._fb.group({
      archivo: [null, Validators.required],
    });
  }
  marcarTabla() {
    this.dataSource.data.forEach((row) => {
      if (row.selected) {
        this.seleccion.select(row);
      } else {
        this.alumnosFallados.push(row);
      }
    });
    this.formulario.controls.alumnos.setValue(this.seleccion.selected);
    this.retAlumnosFallados.emit(this.alumnosFallados);
  }
  filtroRapido(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  buscarArchivo() {
    this.uploader.nativeElement.value = null;
    this.uploader.nativeElement.click();
  }
  subirArchivo($evt) {
    if ($evt) {
      this.formularioArchivo.controls.archivo.setValue($evt.target.files[0].name);
      this.dataSource.data = [];
      this.seleccion.clear();
      this.retArchivo.emit($evt);
    }
  }
  /** Operacion checkbox A */
  todosSeleccionados() {
    const numSelected = this.seleccion.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  /** Operacion checkbox A */
  masterToggle() {
    this.todosSeleccionados() ? this.seleccion.clear() : this.dataSource.data.forEach((row) => this.seleccion.select(row));
  }
}
