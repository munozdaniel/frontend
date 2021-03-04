import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AsignaturaService } from 'app/core/services/asignatura.service';
import { IAsignatura } from 'app/models/interface/iAsignatura';
import { Observable, of } from 'rxjs';
import { finalize, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
@UntilDestroy()
@Component({
  selector: 'app-asignaturas-editar',
  template: `
    <button-volver></button-volver>
    <div fxLayout="column" fxLayoutGap="20px" class="w-100-p p-12 mt-40">
      <div fxLayout="column" class="mat-card mat-elevation-z4 p-24 ">
        <div fxLayout fxLayoutAlign="start center" class="w-100-p mb-12" style="border-bottom: 2px solid #80808057">
          <h1 [@animate]="{ value: '*', params: { x: '50px' } }" class="px-12">{{ titulo }}</h1>
          <mat-spinner *ngIf="cargando" matSuffix class="ml-10" diameter="20"></mat-spinner>
        </div>
        <div fxLayout="row" fxLayoutAlign="space-between baseline">
          <div fxLayout fxLayoutAlign="end center" fxFlex="25"></div>
        </div>
      </div>
      <app-asignaturas-form
        [asignatura]="asignatura"
        [resetear]="resetear"
        [cargando]="cargando"
        (retDatosForm)="setDatosForm($event)"
      ></app-asignaturas-form>
    </div>
  `,
  styles: [],
  animations: [designAnimations],
})
export class AsignaturasEditarComponent implements OnInit {
  titulo = 'Editar Asignatura';
  cargando = true;
  resetear = false;
  asignatura: IAsignatura;
  asignaturaId: string;
  constructor(private _asignaturaService: AsignaturaService, private _activeRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.recuperarDatos();
  }
  recuperarDatos() {
    this._activeRoute.params.subscribe((params) => {
      this.asignaturaId = params['id'];
      console.log(' this.asignaturaId', this.asignaturaId);
      console.log(' this.asignaturaId', this.asignaturaId);
      this.obtenerAsignaturaPorId();
    });
  }
  obtenerAsignaturaPorId() {
    this.cargando = true;
    this._asignaturaService
      .obtenerAsignaturaPorId(this.asignaturaId)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.asignatura = datos;
          this.cargando = false;
        },
        (error) => {
          this.cargando = false;
          console.log('[ERROR]', error);
        }
      );
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
