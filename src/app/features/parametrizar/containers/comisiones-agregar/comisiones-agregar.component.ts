import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComisionService } from 'app/core/services/comision.service';
import { IComision } from 'app/models/interface/iComision';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comisiones-agregar',
  template: `
   <button-volver></button-volver>
    <div fxLayout="column" class="w-100-p p-12 mt-16">
      <h1>Agregar Comision</h1>
      <app-comisiones-form [resetear]="resetear" [cargando]="cargando" (retDatosForm)="setDatosForm($event)"></app-comisiones-form>
    </div>
  `,
  styles: [
  ]
})
export class ComisionesAgregarComponent implements OnInit {
    cargando = false;
    resetear = false;
    constructor(private _comisionService: ComisionService, private _router: Router) {}
  
    ngOnInit(): void {}
    setDatosForm(evento: IComision) {
      console.log('setDatosForm', evento);
      if (evento) {
        this.confirmarGuardar(evento);
      }
    }
    confirmarGuardar(comision: IComision) {
      Swal.fire({
        title: '¿Está seguro de continuar?',
        html: 'Está a punto de guardar un nuevo comision.',
        icon: 'warning',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Si, estoy seguro',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return this._comisionService.agregarComision(comision).pipe(
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
              text: '¿Desea agregar un nuevo comision?.',
              icon: 'success',
              focusConfirm: false,
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Finalizar',
              cancelButtonText: 'Agregar otra comision',
              showLoaderOnConfirm: true,
            }).then((result2) => {
              console.log('result2', result2);
              if (result2.isConfirmed) {
                this._router.navigate(['parametrizar/comisiones-editar/' + result.value._id]);
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
