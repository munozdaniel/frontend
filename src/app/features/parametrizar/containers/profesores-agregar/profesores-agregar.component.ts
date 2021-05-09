import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { designAnimations } from '@design/animations';
import { ProfesorService } from 'app/core/services/profesor.service';
import { IProfesor } from 'app/models/interface/iProfesor';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profesores-agregar',
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
      <app-profesores-form [resetear]="resetear" [cargando]="cargando" (retDatosForm)="setDatosForm($event)"></app-profesores-form>
    </div>
  `,
  styles: [],
  animations: [designAnimations],
})
export class ProfesoresAgregarComponent implements OnInit {
  titulo = 'Agregar Profesor';
  cargando = false;
  resetear = false;
  constructor(private _profesorService: ProfesorService, private _router: Router) {}

  ngOnInit(): void {}
  setDatosForm(evento: IProfesor) {
    if (evento) {
      this.confirmarGuardar(evento);
    }
  }
  confirmarGuardar(profesor: IProfesor) {
    Swal.fire({
      title: '¿Está seguro de continuar?',
      html: 'Está a punto de guardar un nuevo profesor.',
      icon: 'warning',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this._profesorService.agregarProfesor(profesor).pipe(
          catchError((error) => {
            console.log('[ERROR]', error);
            Swal.fire({
              title: 'Oops! Ocurrió un error',
              text: error && error.error ? error.error.message : 'Error de conexion',
              icon: 'error',
            });
            return of(error);
          })
        );
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result: any) => {
      if (result.isConfirmed) {
        if (result.value) {
          Swal.fire({
            title: 'Operación Exitosa!',
            text: '¿Desea agregar un nuevo profesor?.',
            icon: 'success',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Finalizar',
            cancelButtonText: 'Agregar otro profesor',
            showLoaderOnConfirm: true,
          }).then((result2) => {
            if (result2.isConfirmed) {
              this._router.navigate(['parametrizar/profesores-editar/' + result.value._id]);
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
}
