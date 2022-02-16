import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AlumnoService } from 'app/core/services/alumno.service';
import { IAlumno } from 'app/models/interface/iAlumno';
import { IEstadoCursada } from 'app/models/interface/iEstadoCursada';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
@UntilDestroy()
@Component({
  selector: 'app-alumnos-agregar',
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
      <app-alumnos-form
        [resetear]="resetear"
        [cargando]="cargando"
        (retActualizarEstadoCursadas)="setActualizarEstadoCursadas($event)"
        (retAgregarCursada)="setAgregarCursada($event)"
        (retDatosForm)="setDatosForm($event)"
      ></app-alumnos-form>
    </div>
  `,
  styles: [],
  animations: [designAnimations],
})
export class AlumnosAgregarComponent implements OnInit {
  titulo = 'Agregar Alumno';
  cargando = false;
  resetear = false;
  estadoCursada: IEstadoCursada[] = [];
  constructor(private _snackBar: MatSnackBar, private _alumnoService: AlumnoService, private _router: Router) {}

  ngOnInit(): void {}
  setDatosForm(evento: IAlumno) {
    if (evento) {
      this.confirmarGuardar(evento);
    }
  }
  confirmarGuardar(alumno: IAlumno) {
    alumno.estadoCursadas = this.estadoCursada;
    Swal.fire({
      title: '¿Está seguro de continuar?',
      html: 'Está a punto de guardar un nuevo alumno.',
      icon: 'warning',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this._alumnoService.agregarAlumno(alumno).pipe(
          catchError((error) => {
            console.log('[ERROR]', error);
            Swal.fire({
              title: 'Oops! Ocurrió un error',
              text: error && error.error ? error.error.message : 'Error de conexion',
              icon: 'error',
            });
            return of(error);
          }),
          untilDestroyed(this)
        );
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result: any) => {
      if (result.isConfirmed) {
        if (result.value) {
          Swal.fire({
            title: 'Operación Exitosa!',
            text: '¿Desea agregar un nuevo alumno?.',
            icon: 'success',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Finalizar',
            cancelButtonText: 'Agregar otro alumno',
            showLoaderOnConfirm: true,
          }).then((result2) => {
            if (result2.isConfirmed) {
              this._router.navigate(['parametrizar/alumnos-editar/' + result.value._id]);
            } else {
              this.resetear = true;
            }
          });
        } else {
          Swal.fire({
            title: 'Oops! Ocurrió un error',
            text: 'Intentelo nuevamente. Si el problema persiste comuniquese con el soporte técnico.',
            icon: 'error',
          });
        }
      }
    });
  }
  1;
  setAgregarCursada(evento: IEstadoCursada) {
    this.estadoCursada.push(evento);
  }
  setActualizarEstadoCursadas(evento: IEstadoCursada[]) {
    this.estadoCursada = [...evento];
    const texto = 'Recuerde guardar los cambios';
    const accion = 'INFO';
    const duracion = 5000;
    this._snackBar.open(texto, accion, {
      duration: duracion,
      panelClass: ['alert', 'alert-info'],
    });
  }
}
