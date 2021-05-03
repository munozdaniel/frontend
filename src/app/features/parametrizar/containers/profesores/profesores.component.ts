import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ProfesorService } from 'app/core/services/profesor.service';
import { ERROR_EJECUTAR_API, OPERACION_INTERRUMPIDA, ASIGNATURA_ELIMINADO_SUCCESS } from 'app/models/constants/respuestas.const';
import { IProfesor } from 'app/models/interface/iProfesor';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
@UntilDestroy()

@Component({
  selector: 'app-profesores',
  template: `
    <div class="w-100-p p-24" fxLayout="column">
      <app-profesores-menu-param [cargando]="cargando" (retAgregarProfesor)="setAgregarProfesor($event)"> </app-profesores-menu-param>
      <app-profesores-tabla-param
        [cargando]="cargando"
        [profesores]="profesores"
        (retDeshabilitarProfesor)="retDeshabilitarProfesor($event)"
        (retHabilitarProfesor)="retHabilitarProfesor($event)"
      ></app-profesores-tabla-param>
    </div>
  `,
  styles: [
  ]
})
export class ProfesoresComponent implements OnInit {
    profesores: IProfesor[] = [];
    // profesores$: Observable<IProfesor[]>;
    cargando = false;
    constructor(private _router: Router, private _profesorService: ProfesorService) {}
  
    ngOnInit(): void {
      this.buscarProfesoresPorRol();
    }
    buscarProfesoresPorRol(){
      //   if(rol admin){
      // this.buscarProfesoresPorRol();
  
      //   }else{
          this.obtenerProfesoresHabilitadas();
  
      // }
    }
    obtenerProfesores() {
      this.cargando = true;
      this._profesorService
        .obtenerProfesores()
        .pipe(untilDestroyed(this))
        .subscribe(
          (datos) => {
            this.cargando = false;
            this.profesores = datos;
          },
          (error) => {
            this.cargando = false;
            console.log('[ERROR]', error);
          }
        );
    }
    obtenerProfesoresHabilitadas() {
      this.cargando = true;
      this._profesorService
        .obtenerProfesoresHabilitadas()
        .pipe(untilDestroyed(this))
        .subscribe(
          (datos) => {
            console.log('datos', datos);
            this.cargando = false;
            this.profesores = datos;
          },
          (error) => {
            this.cargando = false;
            console.log('[ERROR]', error);
          }
        );
    }
    setAgregarProfesor(evento: boolean) {
      if (evento) {
        this._router.navigate(['/parametrizar/profesores-agregar']);
      }
    }
    retHabilitarProfesor(evento: IProfesor) {
      if (evento) {
        const unProfesor: IProfesor = evento;
        this.confirmarHabilitar(unProfesor);
      }
    }
    confirmarHabilitar(unProfesor: IProfesor) {
      Swal.fire({
        title: '¿Está seguro de continuar?',
        html: 'Está a punto de <strong>ELIMINAR</eliminar> el profesor',
        icon: 'warning',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Si, estoy seguro',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return this._profesorService.habilitarProfesor(unProfesor._id, !unProfesor.activo).pipe(
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
                text: ASIGNATURA_ELIMINADO_SUCCESS,
                icon: 'success',
              });
              this.buscarProfesoresPorRol();
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
    retDeshabilitarProfesor(evento: IProfesor) {
      if (evento) {
        const unProfesor: IProfesor = evento;
        this.confirmarEliminar(unProfesor);
      }
    }
    confirmarEliminar(unProfesor: IProfesor) {
      Swal.fire({
        title: '¿Está seguro de continuar?',
        html: 'Está a punto de <strong>ELIMINAR</eliminar> el profesor',
        icon: 'warning',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Si, estoy seguro',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return this._profesorService.deshabilitarProfesor(unProfesor._id, !unProfesor.activo).pipe(
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
                text: ASIGNATURA_ELIMINADO_SUCCESS,
                icon: 'success',
              });
              this.buscarProfesoresPorRol();
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
