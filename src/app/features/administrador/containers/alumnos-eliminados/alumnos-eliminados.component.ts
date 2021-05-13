import { Component, OnInit } from '@angular/core';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AlumnoService } from 'app/core/services/alumno.service';
import { ERROR_EJECUTAR_API, OPERACION_INTERRUMPIDA, ALUMNO_ELIMINADO_SUCCESS } from 'app/models/constants/respuestas.const';
import { IAlumno } from 'app/models/interface/iAlumno';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
@UntilDestroy()
@Component({
  selector: 'app-alumnos-eliminados',
  template: `
    <button-volver></button-volver>
    <div fxLayout="column" fxLayoutGap="20px" class="w-100-p p-12 mt-40">
      <div fxLayout="column" class="mat-card mat-elevation-z4 p-24 ">
        <div fxLayout fxLayoutAlign="start center" class="w-100-p mb-12" style="border-bottom: 2px solid #80808057">
          <h1 [@animate]="{ value: '*', params: { x: '50px' } }" class="px-12">{{ titulo }}</h1>
          <mat-spinner *ngIf="cargando" matSuffix class="ml-10" diameter="20"></mat-spinner>
        </div>
        <div fxLayout="row" fxLayoutAlign="space-between baseline">
          <div fxLayout fxLayoutAlign="end center" fxFlex="25"></div>
        </div>
      </div>
      <app-alumnos-tabla-param
        [cargando]="cargando"
        [alumnos]="alumnos"
        (retEliminarAlumno)="setEliminarAlumno($event)"
      ></app-alumnos-tabla-param>
    </div>
  `,
  styles: [],
  animations: [designAnimations],
})
export class AlumnosEliminadosComponent implements OnInit {
  titulo = 'Alumnos Eliminados';
  alumnos: IAlumno[] = [];
  cargando = false;
  constructor(private _alumnoService: AlumnoService) {}

  ngOnInit(): void {
    this.obtenerAlumnos();
  }
  obtenerAlumnos() {
    this.cargando = true;
    this._alumnoService
      .obtenerAlumnosInactivos()
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.cargando = false;
          this.alumnos = datos;
        },
        (error) => {
          this.cargando = false;
          console.log('[ERROR]', error);
        }
      );
  }
  setEliminarAlumno(evento: IAlumno) {
    if (evento) {
      const unAlumno: IAlumno = evento;
      this.confirmarHabilitar(unAlumno);
    }
  }
  confirmarHabilitar(unAlumno: IAlumno) {
    Swal.fire({
      title: '¿Está seguro de continuar?',
      html: 'Está a punto de <strong>HABILITAR</strong> el alumno',
      icon: 'warning',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this._alumnoService.toggleEstadoAlumno(unAlumno._id, !unAlumno.activo).pipe(
          catchError((error) => {
            console.log('[ERROR]', error);
            Swal.fire({
              title: 'Oops! Ocurrió un error',
              text: error.error ? error.error.message : ERROR_EJECUTAR_API,
              icon: 'error',
            });
            return of(error);
          })
        );
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result: any) => {
      if (result && result.value.error) {
        Swal.fire({
          title: 'Oops! Ocurrió un error',
          text: result.value.error.error ? result.value.error.error : OPERACION_INTERRUMPIDA,
          icon: 'error',
        });
      }
      if (result.isConfirmed) {
        const resultado = result.value;
        if (!resultado.error) {
          if (resultado.success) {
            Swal.fire({
              title: 'Operación Finalizada',
              text: ALUMNO_ELIMINADO_SUCCESS,
              icon: 'success',
            });
            this.obtenerAlumnos();
          } else {
            Swal.fire({
              title: 'Oops! Ocurrió un error',
              text: resultado.message ? resultado.message : OPERACION_INTERRUMPIDA,
              icon: 'error',
            });
          }
        }
      }
    });
  }
}
