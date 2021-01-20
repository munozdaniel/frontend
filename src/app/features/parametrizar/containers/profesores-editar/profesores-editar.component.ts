import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfesorService } from 'app/core/services/profesor.service';
import { IProfesor } from 'app/models/interface/iProfesor';
import { Observable, of } from 'rxjs';
import { finalize, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profesores-editar',
  template: `
  <button-volver></button-volver>
    <div fxLayout="column" class="w-100-p p-12 mt-16">
      <h1>Editar Profesor</h1>
      <app-profesores-form
        [profesor]="profesor$ | async"
        [resetear]="resetear"
        [cargando]="cargando"
        (retDatosForm)="setDatosForm($event)"
      ></app-profesores-form>
    </div>
  `,
  styles: [
  ]
})
export class ProfesoresEditarComponent implements OnInit {
    cargando = true;
    resetear = false;
    profesor$: Observable<IProfesor>;
    profesorId: string;
    constructor(private _profesorService: ProfesorService, private _activeRoute: ActivatedRoute) {}
  
    ngOnInit(): void {
      this.recuperarDatos();
    }
    recuperarDatos() {
      this._activeRoute.params.subscribe((params) => {
        this.profesorId = params['id'];
        console.log(' this.profesorId', this.profesorId);
        this.profesor$ = this._profesorService.obtenerProfesorPorId(this.profesorId).pipe(finalize(() => (this.cargando = false)));
      });
    }
    setDatosForm(evento: IProfesor) {
      console.log('setDatosForm', evento);
      if (evento) {
        this.confirmarGuardar(evento);
      }
    }
    confirmarGuardar(profesor: IProfesor) {
       Swal.fire({
        title: '¿Está seguro de continuar?',
        html: 'Está a punto de actualizar el profesor: ' + profesor.nombreCompleto,
        icon: 'warning',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Si, estoy seguro',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return this._profesorService.actualizarProfesor(this.profesorId, profesor).pipe(
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
              text: 'El profesor ha sido actualizado correctamente.',
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
