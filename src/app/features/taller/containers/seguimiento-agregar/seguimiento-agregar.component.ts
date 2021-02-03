import { Component, OnInit } from '@angular/core';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AlumnoService } from 'app/core/services/alumno.service';
import { SeguimientoAlumnoService } from 'app/core/services/seguimientoAlumno.service';
import { IAlumno } from 'app/models/interface/iAlumno';
import { ISeguimientoAlumno } from 'app/models/interface/iSeguimientoAlumno';
@UntilDestroy()
@Component({
  selector: 'app-seguimiento-agregar',
  template: `
    <div fxLayout="column" class="w-100-p p-24" fxLayoutGap="20px">
      <button-volver></button-volver>
      <div class="mat-card mat-elevation-z4 p-24 mt-12" fxLayout="row" fxLayoutAlign="space-between center">
        <div fxLayout fxLayoutAlign="start center">
          <h1 [@animate]="{ value: '*', params: { x: '50px' } }" class="px-12">{{ titulo }}</h1>
          <mat-spinner *ngIf="cargando" matSuffix class="ml-10" diameter="20"></mat-spinner>
        </div>
      </div>
      <!-- ===== -->
      <div fxLayout.gt-xs="row" fxLayout.xs="row wrap" fxLayoutAlign.gt-xs="space-between start">
        <app-seguimiento-busqueda-alumno
          fxFlex.gt-xs="35"
          fxFlex.xs="100"
          [cargando]="cargando"
          [alumnos]="alumnos"
          (retAlumno)="setAlumno($event)"
        ></app-seguimiento-busqueda-alumno>
        <app-seguimiento-alumno-form  [cargando]="cargando" fxFlex.gt-xs="35" fxFlex.xs="100"></app-seguimiento-alumno-form>
      </div>
    </div>
  `,
  styles: [],
  animations: [designAnimations],
})
export class SeguimientoAgregarComponent implements OnInit {
  titulo = 'Agregar Seguimiento de Alumno';
  cargando = false;
  seguimientoAlumno: ISeguimientoAlumno;
  alumnos: IAlumno[];
  alumnoSeleccionado: IAlumno;
  constructor(private _alumnoService: AlumnoService, private _seguimientoAlumnoService: SeguimientoAlumnoService) {}

  ngOnInit(): void {
    this.recuperarAlumnos();
  }
  recuperarAlumnos() {
    this.cargando = true;

    this._alumnoService
      .obtenerAlumnos()
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.alumnos = datos;
          this.cargando = false;
        },
        (error) => {
          console.log('[ERROR]', error);
          this.cargando = false;
        }
      );
  }
  setAlumno(evento:IAlumno)
  {
      if(evento){
          this.alumnoSeleccionado =evento;
      }
  }
}
