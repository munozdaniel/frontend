import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AlumnoService } from 'app/core/services/alumno.service';
import { CicloLectivoService } from 'app/core/services/ciclo-lectivo.service';
import { SeguimientoAlumnoService } from 'app/core/services/seguimientoAlumno.service';
import { TemplateEnum } from 'app/models/constants/tipo-template.const';
import { IAlumno } from 'app/models/interface/iAlumno';
import { ICicloLectivo } from 'app/models/interface/iCicloLectivo';
import { ISeguimientoAlumno } from 'app/models/interface/iSeguimientoAlumno';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { SeguimientoFormModalComponent } from '../seguimiento-form-modal/seguimiento-form-modal.component';
@UntilDestroy()
@Component({
  selector: 'app-seguimiento-agregar',
  template: `
    <div fxLayout="column" class="w-100-p p-24" fxLayoutGap="20px">
      <button-volver></button-volver>
      <div class="mat-card mat-elevation-z4 p-24 mt-12" fxLayout="row" fxLayoutAlign="space-between center">
        <div fxLayout fxLayoutAlign="start center">
          <h1 [@animate]="{ value: '*', params: { x: '50px' } }" class="px-12">{{ titulo }}</h1>
          <mat-spinner *ngIf="cargando" matSuffix class="ml-10" diameter="20"></mat-spinner>
        </div>
      </div>
      <!-- ===== -->
      <app-planilla-detalle-seguimiento
        [template]="template"
        [seguimientos]="seguimientos"
        [cargandoAlumnos]="cargandoAlumnos"
        [alumnos]="alumnos"
        [cargandoSeguimiento]="cargandoSeguimiento"
        (retBuscarSeguimientosPorAlumno)="setBuscarSeguimientosPorAlumno($event)"
        (retAbrirModalSeguimiento)="setAbrirModalSeguimiento($event)"
        (retEliminarSeguimiento)="setEliminarSeguimiento($event)"
        (retEditarSeguimiento)="setEditarSeguimiento($event)"
      >
      </app-planilla-detalle-seguimiento>
    </div>
  `,
  styles: [],
  animations: [designAnimations],
})
export class SeguimientoAgregarComponent implements OnInit {
  template = TemplateEnum.EDICION;
  titulo = 'Agregar Seguimiento de Alumno';
  cargando = false;
  seguimientoAlumno: ISeguimientoAlumno;
  //   Alumnos
  cargandoAlumnos = false;
  alumnos: IAlumno[];
  alumnoSeleccionado: IAlumno;
  //   Seguimiento
  seguimientos: ISeguimientoAlumno[];
  cargandoSeguimiento: boolean;
  //   cicloLectivo
  cicloLectivo: ICicloLectivo;
  ciclosLectivos: ICicloLectivo[];
  // Los seguimientos generales no tienen asignados una planilla. Pueden ser encontrados por ciclo
  constructor(
    private _dialog: MatDialog,
    private _alumnoService: AlumnoService,
    private _seguimientoAlumnoService: SeguimientoAlumnoService,
    private _cicloLectivoService: CicloLectivoService
  ) {}

  ngOnInit(): void {
    this.recuperarAlumnos();
  }
  recuperarAlumnos() {
    this.cargando = true;
    this._cicloLectivoService
      .obtenerCiclosLectivos()
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.ciclosLectivos = datos;
        },
        (error) => {
          console.log('[ERROR]', error);
        }
      );
    this._alumnoService
      .obtenerAlumnos()
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.alumnos = datos;
          this.cargando = false;
        },
        (error) => {
          console.log('[ERROR]', error);
          this.cargando = false;
        }
      );
  }
  setAlumno(evento: IAlumno) {
    if (evento) {
      this.alumnoSeleccionado = evento;
    }
  }
  setBuscarSeguimientosPorAlumno(alumno: IAlumno) {
    this.alumnoSeleccionado = alumno; // cuando viene por output se actualiza
    this.cargandoSeguimiento = true;
    this._seguimientoAlumnoService
      .obtenerPorAlumno(alumno._id)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.seguimientos = [...datos];
          this.cargandoSeguimiento = false;
        },
        (error) => {
          this.cargandoSeguimiento = false;
          console.log('[ERROR]', error);
        }
      );
  }
  setAbrirModalSeguimiento(evento) {
    if (!this.alumnoSeleccionado) {
      Swal.fire({
        title: 'Seleccione un alumno',
        text: 'Para gestionar el seguimiento debe seleccionar al alumno',
        icon: 'error',
      });
      return;
    }

    const dialogRef = this._dialog.open(SeguimientoFormModalComponent, {
      data: { ciclosLectivos: this.ciclosLectivos, alumno: this.alumnoSeleccionado },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.setBuscarSeguimientosPorAlumno(this.alumnoSeleccionado);
      }
    });
  }
  setEditarSeguimiento(seguimiento: ISeguimientoAlumno) {
    if (!this.alumnoSeleccionado) {
      Swal.fire({
        title: 'Seleccione un alumno',
        text: 'Para gestionar el seguimiento debe seleccionar al alumno',
        icon: 'error',
      });
      return;
    }
    if (!seguimiento) {
      Swal.fire({
        title: 'Seleccione el seguimiento del alumno',
        text: 'Para editar el seguimiento debe seleccionarla primero',
        icon: 'error',
      });
      return;
    }
    const dialogRef = this._dialog.open(SeguimientoFormModalComponent, {
      data: { ciclosLectivos: this.ciclosLectivos, seguimiento: seguimiento, alumno: this.alumnoSeleccionado },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.setBuscarSeguimientosPorAlumno(this.alumnoSeleccionado);
      }
    });
  }
  setEliminarSeguimiento(seguimiento: ISeguimientoAlumno) {
    Swal.fire({
      title: '¿Está seguro de continuar?',
      html: 'Está a punto de <strong>ELIMINAR PERMANENTEMENTE</strong> el seguimiento',
      icon: 'warning',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this._seguimientoAlumnoService.eliminarSeguimientoAlumno(seguimiento._id).pipe(
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
        if (result.value && result.value.status === 200) {
          Swal.fire({
            title: 'Operación Exitosa',
            text: 'El seguimiento ha sido actualizado correctamente.',
            icon: 'success',
          });
          this.setBuscarSeguimientosPorAlumno(this.alumnoSeleccionado);
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
