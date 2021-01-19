import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsignaturaService } from 'app/core/services/asignatura.service';
import { IAsignatura } from 'app/models/interface/iAsignatura';
import { Observable, of } from 'rxjs';
import { finalize, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignaturas-editar',
  template: `
     <button-volver></button-volver>
    <div fxLayout="column" class="w-100-p p-12 mt-16">
      <h1>Editar Asignatura</h1>
      <app-asignaturas-form
        [asignatura]="asignatura$ | async"
        [resetear]="resetear"
        [cargando]="cargando"
        (retDatosForm)="setDatosForm($event)"
      ></app-asignaturas-form>
    </div>
  `,
  styles: [
  ]
})
export class AsignaturasEditarComponent implements OnInit {
    cargando = true;
    resetear = false;
    asignatura$: Observable<IAsignatura>;
    asignaturaId: string;
    constructor(private _asignaturaService: AsignaturaService, private _activeRoute: ActivatedRoute) {}
  
    ngOnInit(): void {
      this.recuperarDatos();
    }
    recuperarDatos() {
      this._activeRoute.params.subscribe((params) => {
        this.asignaturaId = params['id'];
        console.log(' this.asignaturaId', this.asignaturaId);
        this.asignatura$ = this._asignaturaService.obtenerAsignaturaPorId(this.asignaturaId).pipe(finalize(() => (this.cargando = false)));
      });
    }
    setDatosForm(evento: IAsignatura) {
      console.log('setDatosForm', evento);
      if (evento) {
        this.confirmarGuardar(evento);
      }
    }
    confirmarGuardar(asignatura: IAsignatura) {
       Swal.fire({
        title: '¿Está seguro de continuar?',
        html: 'Está a punto de actualizar el asignatura: ' + asignatura.detalle,
        icon: 'warning',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Si, estoy seguro',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return this._asignaturaService.actualizarAsignatura(this.asignaturaId, asignatura).pipe(
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
              title: 'Operación Exitosa',
              text: 'El asignatura ha sido actualizado correctamente.',
              icon: 'success',
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
