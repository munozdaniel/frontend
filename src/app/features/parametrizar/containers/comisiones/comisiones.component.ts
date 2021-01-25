import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ComisionService } from 'app/core/services/comision.service';
import { ERROR_EJECUTAR_API, OPERACION_INTERRUMPIDA, ASIGNATURA_ELIMINADO_SUCCESS } from 'app/models/constants/respuestas.const';
import { IComision } from 'app/models/interface/iComision';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
@UntilDestroy()

@Component({
  selector: 'app-comisiones',
  template: `
     <div class="w-100-p p-24" fxLayout="column">
      <app-comisiones-menu-param [cargando]="cargando" (retAgregarComision)="setAgregarComision($event)"> </app-comisiones-menu-param>
      <app-comisiones-tabla-param
        [cargando]="cargando"
        [comisiones]="comisiones"
        (retDeshabilitarComision)="retDeshabilitarComision($event)"
        (retHabilitarComision)="retHabilitarComision($event)"
      ></app-comisiones-tabla-param>
    </div>
  `,
  styles: [
  ]
})
export class ComisionesComponent implements OnInit {
    comisiones: IComision[] = [];
    // comisiones$: Observable<IComision[]>;
    cargando = false;
    constructor(private _router: Router, private _comisionService: ComisionService) {}
  
    ngOnInit(): void {
      this.buscarComisionesPorRol();
    }
    buscarComisionesPorRol(){
      //   if(rol admin){
      // this.buscarComisionesPorRol();
  
      //   }else{
          this.obtenerComisionesHabilitadas();
  
      // }
    }
    obtenerComisiones() {
      this.cargando = true;
      this._comisionService
        .obtenerComisiones()
        .pipe(untilDestroyed(this))
        .subscribe(
          (datos) => {
            console.log('datos', datos);
            this.cargando = false;
            this.comisiones = datos;
          },
          (error) => {
            this.cargando = false;
            console.log('[ERROR]', error);
          }
        );
    }
    obtenerComisionesHabilitadas() {
      this.cargando = true;
      this._comisionService
        .obtenerComisionesHabilitadas()
        .pipe(untilDestroyed(this))
        .subscribe(
          (datos) => {
            console.log('datos', datos);
            this.cargando = false;
            this.comisiones = datos;
          },
          (error) => {
            this.cargando = false;
            console.log('[ERROR]', error);
          }
        );
    }
    setAgregarComision(evento: boolean) {
      if (evento) {
        this._router.navigate(['/parametrizar/comisiones-agregar']);
      }
    }
    retHabilitarComision(evento: IComision) {
      if (evento) {
        const unComision: IComision = evento;
        this.confirmarHabilitar(unComision);
      }
    }
    confirmarHabilitar(unComision: IComision) {
      Swal.fire({
        title: '¿Está seguro de continuar?',
        html: 'Está a punto de <strong>ELIMINAR</eliminar> el comision',
        icon: 'warning',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Si, estoy seguro',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return this._comisionService.habilitarComision(unComision._id, !unComision.activo).pipe(
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
              this.buscarComisionesPorRol();
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
    retDeshabilitarComision(evento: IComision) {
      if (evento) {
        const unComision: IComision = evento;
        this.confirmarEliminar(unComision);
      }
    }
    confirmarEliminar(unComision: IComision) {
      Swal.fire({
        title: '¿Está seguro de continuar?',
        html: 'Está a punto de <strong>ELIMINAR</eliminar> el comision',
        icon: 'warning',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Si, estoy seguro',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return this._comisionService.deshabilitarComision(unComision._id, !unComision.activo).pipe(
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
              this.buscarComisionesPorRol();
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
