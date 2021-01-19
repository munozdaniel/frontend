import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AsignaturaService } from 'app/core/services/asignatura.service';
import { IAsignatura } from 'app/models/interface/iAsignatura';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignaturas-agregar',
  template: `
    <button-volver></button-volver>
    <div fxLayout="column" class="w-100-p p-12 mt-16">
      <h1>Agregar Asignatura</h1>
      <app-asignaturas-form [resetear]="resetear" [cargando]="cargando" (retDatosForm)="setDatosForm($event)"></app-asignaturas-form>
    </div>
  `,
  styles: [
  ]
})
export class AsignaturasAgregarComponent implements OnInit {

    cargando = false;
    resetear = false;
    constructor(private _asignaturaService: AsignaturaService, private _router: Router) {}
  
    ngOnInit(): void {}
    setDatosForm(evento: IAsignatura) {
      console.log('setDatosForm', evento);
      if (evento) {
        this.confirmarGuardar(evento);
      }
    }
    confirmarGuardar(asignatura: IAsignatura) {
      Swal.fire({
        title: '¿Está seguro de continuar?',
        html: 'Está a punto de guardar un nuevo asignatura.',
        icon: 'warning',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Si, estoy seguro',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return this._asignaturaService.agregarAsignatura(asignatura).pipe(
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
              text: '¿Desea agregar un nuevo asignatura?.',
              icon: 'success',
              focusConfirm: false,
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Finalizar',
              cancelButtonText: 'Agregar otro asignatura',
              showLoaderOnConfirm: true,
            }).then((result2) => {
              console.log('result2', result2);
              if (result2.isConfirmed) {
                this._router.navigate(['parametrizar/asignaturas-editar/' + result.value._id]);
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
