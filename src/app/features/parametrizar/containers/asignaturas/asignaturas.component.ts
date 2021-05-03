import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AsignaturaService } from 'app/core/services/asignatura.service';
import { ERROR_EJECUTAR_API, OPERACION_INTERRUMPIDA, ASIGNATURA_ELIMINADO_SUCCESS } from 'app/models/constants/respuestas.const';
import { IAsignatura } from 'app/models/interface/iAsignatura';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
@UntilDestroy()
@Component({
  selector: 'app-asignaturas',
  template: `
    <div class="w-100-p p-24" fxLayout="column">
      <app-asignaturas-menu-param [cargando]="cargando" (retAgregarAsignatura)="setAgregarAsignatura($event)"> </app-asignaturas-menu-param>
      <app-asignaturas-tabla-param
        [cargando]="cargando"
        [asignaturas]="asignaturas"
        (retDeshabilitarAsignatura)="retDeshabilitarAsignatura($event)"
        (retHabilitarAsignatura)="retHabilitarAsignatura($event)"
      ></app-asignaturas-tabla-param>
    </div>
  `,
  styles: [],
})
export class AsignaturasComponent implements OnInit {
  asignaturas: IAsignatura[] = [];
  // asignaturas$: Observable<IAsignatura[]>;
  cargando = false;
  constructor(private _router: Router, private _asignaturaService: AsignaturaService) {}

  ngOnInit(): void {
    this.buscarAsignaturasPorRol();
  }
  buscarAsignaturasPorRol(){
    //   if(rol admin){
    // this.buscarAsignaturasPorRol();

    //   }else{
        this.obtenerAsignaturasHabilitadas();

    // }
  }
  obtenerAsignaturas() {
    this.cargando = true;
    this._asignaturaService
      .obtenerAsignaturas()
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.cargando = false;
          this.asignaturas = datos;
        },
        (error) => {
          this.cargando = false;
          console.log('[ERROR]', error);
        }
      );
  }
  obtenerAsignaturasHabilitadas() {
    this.cargando = true;
    this._asignaturaService
      .obtenerAsignaturasHabilitadas()
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          console.log('datos', datos);
          this.cargando = false;
          this.asignaturas = datos;
        },
        (error) => {
          this.cargando = false;
          console.log('[ERROR]', error);
        }
      );
  }
  setAgregarAsignatura(evento: boolean) {
    if (evento) {
      this._router.navigate(['/parametrizar/asignaturas-agregar']);
    }
  }
  retHabilitarAsignatura(evento: IAsignatura) {
    if (evento) {
      const unAsignatura: IAsignatura = evento;
      this.confirmarHabilitar(unAsignatura);
    }
  }
  confirmarHabilitar(unAsignatura: IAsignatura) {
    Swal.fire({
      title: '¿Está seguro de continuar?',
      html: 'Está a punto de <strong>ELIMINAR</eliminar> el asignatura',
      icon: 'warning',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this._asignaturaService.habilitarAsignatura(unAsignatura._id, !unAsignatura.activo).pipe(
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
            this.buscarAsignaturasPorRol();
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
  retDeshabilitarAsignatura(evento: IAsignatura) {
    if (evento) {
      const unAsignatura: IAsignatura = evento;
      this.confirmarEliminar(unAsignatura);
    }
  }
  confirmarEliminar(unAsignatura: IAsignatura) {
    Swal.fire({
      title: '¿Está seguro de continuar?',
      html: 'Está a punto de <strong>ELIMINAR</eliminar> el asignatura',
      icon: 'warning',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this._asignaturaService.deshabilitarAsignatura(unAsignatura._id, !unAsignatura.activo).pipe(
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
      console.log('[result]', result);
      if (result && result.value.error) {
        Swal.fire({
          title: 'Oops! Ocurrió un error',
          text: result.value.error.error ? result.value.error.error : OPERACION_INTERRUMPIDA,
          icon: 'error',
        });
      }
      if (result.isConfirmed) {
        const resultado = result.value;
        console.log('result1', resultado);
        if (!resultado.error) {
          if (resultado.success) {
            Swal.fire({
              title: 'Operación Finalizada',
              text: ASIGNATURA_ELIMINADO_SUCCESS,
              icon: 'success',
            });
            this.buscarAsignaturasPorRol();
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
