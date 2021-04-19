import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AlumnoService } from 'app/core/services/alumno.service';
import { AsistenciaService } from 'app/core/services/asistencia.service';
import { IAlumno } from 'app/models/interface/iAlumno';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
@UntilDestroy()
@Component({
  selector: 'app-inasistencias-alumnos',
  template: `
    <button-volver></button-volver>
    <div fxLayout="column" class="w-100-p p-24 mt-50" fxLayoutGap="20px">
      <div fxLayout="column" class="mat-card mat-elevation-z4 p-24">
        <div fxLayout fxLayoutAlign="start center" class="w-100-p mb-12" style="border-bottom: 2px solid #80808057">
          <h1 [@animate]="{ value: '*', params: { x: '50px' } }" class="px-12">{{ titulo }}</h1>
          <mat-spinner *ngIf="cargando" matSuffix class="ml-10" diameter="20"></mat-spinner>
        </div>
        <form
          *ngIf="form"
          [formGroup]="form"
          fxLayout="row wrap"
          fxLayoutAlign.xs="center start"
          fxLayoutAlign.gt-xs="start baseline"
          fxLayoutGap.gt-xs="10px"
          (ngSubmit)="buscarInasistencias()"
        >
          <mat-form-field appearance="outline" fxFlex.xs="100">
            <mat-label>Fecha</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="fecha" />
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
            <mat-error *ngIf="form.controls.fecha.hasError('required')"> Este campo es requerido. </mat-error>
          </mat-form-field>
          <button mat-raised-button color="primary"><mat-icon>search</mat-icon> Buscar</button>
        </form>
      </div>
      <!--  -->
      <app-alumnos-tabla-email [cargando]="cargando" [alumnos]="alumnos"></app-alumnos-tabla-email>
      <div fxLayout="row" fxLayoutAlign="center start" fxLayoutGap="20px">
        <button [disabled]="!alumnos || alumnos.length < 1" mat-raised-button color="warn" (click)="generarReporte()">
          Generar Reporte
        </button>
        <button [disabled]="!alumnos || alumnos.length < 1" mat-raised-button color="accent" (click)="enviarEmail()">
          Enviar Email Masivo
        </button>
      </div>
      <div *ngIf="alumnosNoRegistrados.length > 0" fxLayout="column" class="text-center text-red mat-card mat-elevation-z4 p-24">
        <h3
          style="color: red;
    font-weight: bolder;"
        >
          Los siguientes alumnos no tienen un email registrado para ser notificados
        </h3>
        <app-alumnos-tabla-email [cargando]="cargando" [alumnos]="alumnosNoRegistrados" class="w-100-p"></app-alumnos-tabla-email>
      </div>
    </div>
  `,
  styles: [],
  animations: [designAnimations],
})
export class InasistenciasAlumnosComponent implements OnInit {
  titulo = 'Ver Inasistencias';
  cargando = false;
  alumnos: IAlumno[];
  alumnosNoRegistrados: IAlumno[] = [];
  form: FormGroup;
  constructor(private _fb: FormBuilder, private _asistenciaService: AsistenciaService, private _alumnoService: AlumnoService) {}

  ngOnInit(): void {
    const today = new Date();
    this.form = this._fb.group({
      fecha: [today, Validators.required],
    });
  }
  buscarInasistencias() {
    this.alumnosNoRegistrados = [];
    this.cargando = true;
    if (this.form.invalid) {
      Swal.fire({
        title: 'Oops! Datos incorrectos',
        text: 'El formulario no tiene una fecha válida. Verifique sus datos.',
        icon: 'error',
      });
      return;
    }
    //   Buscar todas las plantillas
    this._asistenciaService
      .buscarInasistencias(this.form.controls.fecha.value)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos: any) => {
          this.alumnos = [...datos.alumnos];
          this.alumnosNoRegistrados = [...datos.alumnosNoRegistrados];
          this.cargando = false;
        },
        (error) => {
          this.cargando = false;
          console.log('[ERROR]', error);
        }
      );
  }
  enviarEmail() {
    const alumnosRegistrados: IAlumno[] = this.alumnos.filter((x) => {
      const emailEncontrado = x.adultos.find((a) => a.email);
      if (emailEncontrado) {
        return x;
      }
    });
    Swal.fire({
      title: '¿Está seguro de continuar?',
      html:
        'Está a punto de enviar un email informando la inasistencia de los alumnos. Como criterio se utilizará al primer tutor/padre/madre que tenga un email registrado.',
      icon: 'warning',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this._alumnoService.enviarEmailMasivo(alumnosRegistrados, this.form.controls.fecha.value).pipe(
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
  generarReporte() {
    Swal.fire({
      title: 'En construccion',
      text: 'Generar informes toma tiempo, muy pronto tendrá novedades',
      icon: 'success',
      timer: 2000,
      timerProgressBar: true,
    }).then(() => {});
  }
}
