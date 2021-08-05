import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AlumnoService } from 'app/core/services/alumno.service';
import { IAlumno } from 'app/models/interface/iAlumno';
import { IEstadoCursada } from 'app/models/interface/iEstadoCursada';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
@UntilDestroy()
@Component({
  selector: 'app-alumnos-editar',
  template: `
    <button-volver></button-volver>
    <div fxLayout="column" fxLayoutGap="20px" class="w-100-p p-12 mt-40">
      <!-- <div fxLayout="column" class="mat-card mat-elevation-z4 p-24 ">
        <div fxLayout fxLayoutAlign="start center" class="w-100-p mb-12" style="border-bottom: 2px solid #80808057">
          <h1 [@animate]="{ value: '*', params: { x: '50px' } }" class="px-12">{{ titulo }}</h1>
          <mat-spinner *ngIf="cargando" matSuffix class="ml-10" diameter="20"></mat-spinner>
        </div>
        <div fxLayout="row" fxLayoutAlign="space-between baseline">
          <div fxLayout fxLayoutAlign="end center" fxFlex="25"></div>
        </div>
      </div> -->
      <!-- (retEditarEstadoCursada)="setEditarEstadoCursada($event)" -->
      <app-alumnos-form
        [titulo]="titulo"
        [alumno]="alumno"
        [resetear]="resetear"
        [cargando]="cargando"
        [estadoCursadaEditada]="estadoCursadaEditada"
        (retAgregarCursada)="setAgregarCursada($event)"
        (retDatosForm)="setDatosForm($event)"
        (retEliminarArchivo)="setEliminarArchivo($event)"
      ></app-alumnos-form>
    </div>
  `,
  styles: [],
  animations: [designAnimations],
})
export class AlumnosEditarComponent implements OnInit {
  titulo = 'Editar Alumno';
  cargando = true;
  resetear = false;
  alumno: IAlumno;
  alumnoId: string;
  estadoCursadaEditada: IEstadoCursada;
  constructor(
    private _alumnoService: AlumnoService,
    private _activeRoute: ActivatedRoute,
    private _router: Router,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.recuperarDatos();
  }
  recuperarDatos() {
    this.cargando = true;
    this._activeRoute.params.subscribe((params) => {
      this.alumnoId = params['id'];
      this._alumnoService
        .obtenerAlumnoPorId(this.alumnoId)
        .pipe(untilDestroyed(this))
        .subscribe(
          (datos) => {
            this.cargando = false;
            if (!datos) {
              Swal.fire({
                title: 'Alumno no encontrado',
                text: 'Es posible que el alumno solicitado haya sido eliminado',
                icon: 'error',
                timer: 2000,
                timerProgressBar: true,
              }).then(() => {
                this._router.navigate(['/parametrizar/alumnos']);
              });
            } else {
              this.alumno = { ...datos };
            }
          },
          (error) => {
            console.log('[ERROR]', error);
            this.cargando = false;
            this._router.navigate(['/parametrizar/alumnos']);
          }
        );
    });
  }
  setEliminarArchivo({ alumno, archivo }) {
    Swal.fire({
      title: '¿Está seguro de continuar?',
      html: 'Está a punto de ELIMINAR el archivo ',
      icon: 'warning',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this._alumnoService.eliminarArchivo(this.alumnoId, archivo).pipe(
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
        if (result.value) {
          this.alumno.archivoDiagnostico = result.value;
          this.alumno = { ...this.alumno };
          Swal.fire({
            title: 'Operación Exitosa',
            text: 'El archivo ha sido eliminado correctamente.',
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
  setDatosForm(evento: IAlumno) {
    if (evento) {
      this.confirmarGuardar(evento);
    }
  }
  confirmarGuardar(alumno: IAlumno) {
    alumno.incompleto = false;
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
  //   Antes de poder editar un estadoDeCursada tenemos que verificar que no haya estado usado por algun alumno
  setAgregarCursada(evento: IEstadoCursada) {
    console.log('alumnos editar', evento);
    this._alumnoService
      .agregarEstadoCursada(evento, this.alumnoId)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.recuperarDatos();
        },
        (error) => {
          console.log('[ERROR]', error);
        }
      );
  }
  //   setEditarEstadoCursada(evento: IEstadoCursada) {
  //     this._alumnoService
  //       .actualizarEstadoCursada(evento, this.alumnoId)
  //       .pipe(untilDestroyed(this))
  //       .subscribe(
  //         (datos) => {
  //           this.recuperarDatos();
  //         },
  //         (error) => {
  //           console.log('[ERROR]', error);
  //         }
  //       );
  //   }
}
