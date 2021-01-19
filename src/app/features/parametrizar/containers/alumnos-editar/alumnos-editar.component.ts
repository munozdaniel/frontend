import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlumnoService } from 'app/core/services/alumno.service';
import { IAlumno } from 'app/models/interface/iAlumno';
import { Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-alumnos-editar',
  template: `
    <button-volver></button-volver>
    <div fxLayout="column" class="w-100-p p-12 mt-16">
      <h1>Editar Alumno</h1>
      <app-alumnos-form
        [alumno]="alumno$ | async"
        [resetear]="resetear"
        [cargando]="cargando"
        (retDatosForm)="setDatosForm($event)"
      ></app-alumnos-form>
    </div>
  `,
  styles: [],
})
export class AlumnosEditarComponent implements OnInit {
  cargando = true;
  resetear = false;
  alumno$: Observable<IAlumno>;
  alumnoId: string;
  constructor(private _alumnoService: AlumnoService, private _activeRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.recuperarDatos();
  }
  recuperarDatos() {
    this._activeRoute.params.subscribe((params) => {
      this.alumnoId = params['id'];
      console.log(' this.alumnoId', this.alumnoId);
      this.alumno$ = this._alumnoService.obtenerAlumnoPorId(this.alumnoId).pipe(finalize(() => (this.cargando = false)));
    });
  }
  setDatosForm(evento: IAlumno) {
    console.log('setDatosForm', evento);
    if (evento) {
      this.confirmarGuardar(evento);
    }
  }
  confirmarGuardar(alumno: IAlumno) {
    console.log('alumno length ', alumno.dni.length);
    Swal.fire({
      title: '¿Está seguro de continuar?',
      html: 'Está a punto de actualizar el alumno: ' + alumno.nombreCompleto,
      icon: 'warning',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this._alumnoService.actualizarAlumno(this.alumnoId, alumno).pipe(
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
            text: 'El alumno ha sido actualizado correctamente.',
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
