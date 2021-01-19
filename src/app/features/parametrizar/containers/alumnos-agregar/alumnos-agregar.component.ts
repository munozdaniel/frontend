import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlumnoService } from 'app/core/services/alumno.service';
import { IAlumno } from 'app/models/interface/iAlumno';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-alumnos-agregar',
  template: `
    <button-volver></button-volver>
    <div fxLayout="column" class="w-100-p p-12 mt-16">
      <h1>Agregar Alumno</h1>
      <app-alumnos-form [resetear]="resetear" [cargando]="cargando" (retDatosForm)="setDatosForm($event)"></app-alumnos-form>
    </div>
  `,
  styles: [],
})
export class AlumnosAgregarComponent implements OnInit {
  cargando = false;
  resetear = false;
  constructor(private _alumnoService: AlumnoService, private _router: Router) {}

  ngOnInit(): void {}
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
            text: '¿Desea agregar un nuevo alumno?.',
            icon: 'success',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Finalizar',
            cancelButtonText: 'Agregar otro alumno',
            showLoaderOnConfirm: true,
          }).then((result2) => {
            console.log('result2', result2);
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
}
