import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfesorService } from 'app/core/services/profesor.service';
import { IProfesor } from 'app/models/interface/iProfesor';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profesores-agregar',
  template: `
   <button-volver></button-volver>
    <div fxLayout="column" class="w-100-p p-12 mt-16">
      <h1>Agregar Profesor</h1>
      <app-profesores-form [resetear]="resetear" [cargando]="cargando" (retDatosForm)="setDatosForm($event)"></app-profesores-form>
    </div>
  `,
  styles: [
  ]
})
export class ProfesoresAgregarComponent implements OnInit {
    cargando = false;
    resetear = false;
    constructor(private _profesorService: ProfesorService, private _router: Router) {}
  
    ngOnInit(): void {}
    setDatosForm(evento: IProfesor) {
      console.log('setDatosForm', evento);
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
          console.log('result1', result);
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
              console.log('result2', result2);
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
