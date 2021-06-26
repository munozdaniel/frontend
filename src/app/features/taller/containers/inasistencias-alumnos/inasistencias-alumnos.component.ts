import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AlumnoService } from 'app/core/services/alumno.service';
import { AsistenciaService } from 'app/core/services/asistencia.service';
import { IAlumno } from 'app/models/interface/iAlumno';
import * as moment from 'moment';
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
        <form *ngIf="form" [formGroup]="form" fxLayout="column" class=" w-100-p" (ngSubmit)="buscarInasistencias()">
          <div
            fxLayout="row wrap"
            [fxLayoutAlign]="rangoHabilitado ? 'start center' : 'start center'"
            [fxLayoutGap]="rangoHabilitado ? '10px' : '10px'"
          >
            <mat-form-field appearance="outline" fxFlex.gt-xs="30" fxFlex.xs="100">
              <mat-label>Fecha Desde </mat-label>
              <input matInput [matDatepicker]="picker" formControlName="fechaDesde" />
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-error *ngIf="form.controls.fechaDesde.hasError('required')"> Este campo es requerido. </mat-error>
            </mat-form-field>
            <mat-form-field *ngIf="rangoHabilitado" appearance="outline" fxFlex.gt-xs="30" fxFlex.xs="100">
              <mat-label>Fecha Hasta</mat-label>
              <input matInput [matDatepicker]="pickerHasta" formControlName="fechaHasta" />
              <mat-datepicker-toggle matSuffix [for]="pickerHasta"></mat-datepicker-toggle>
              <mat-datepicker #pickerHasta></mat-datepicker>
              <mat-error *ngIf="form.controls.fechaHasta.hasError('required')"> Este campo es requerido. </mat-error>
            </mat-form-field>
            <mat-checkbox class="mb-12" (click)="habilitarRango()">Buscar por rango</mat-checkbox>
          </div>
          <div fxLayout="row wrap" fxLayoutAlign="space-between start">
            <mat-form-field appearance="outline" fxFlex.gt-xs="30" fxFlex.xs="100">
              <mat-label class="lbl">Turno</mat-label>
              <mat-select formControlName="turno">
                <mat-option value="MAÑANA">MAÑANA</mat-option>
                <mat-option value="TARDE">TARDE</mat-option>
                <mat-option value="VESPERTINO">VESPERTINO</mat-option>
              </mat-select>
              <mat-error *ngIf="form.controls.turno.hasError('required')"> Este campo es requerido. </mat-error>
            </mat-form-field>
            <mat-form-field appearance="outline" fxFlex.gt-xs="30" fxFlex.xs="100">
              <mat-label class="lbl">Curso</mat-label>
              <mat-select formControlName="curso">
                <mat-option value=""></mat-option>
                <mat-option value="1">CURSO 1</mat-option>
                <mat-option value="2">CURSO 2</mat-option>
                <mat-option value="3">CURSO 3</mat-option>
                <mat-option value="4">CURSO 4</mat-option>
                <mat-option value="5">CURSO 5</mat-option>
                <mat-option value="6">CURSO 6</mat-option>
              </mat-select>
              <mat-error *ngIf="form.controls.curso.hasError('required')"> Este campo es requerido. </mat-error>
            </mat-form-field>
            <!-- division ============================= -->
            <mat-form-field appearance="outline" fxFlex.gt-xs="30" fxFlex.xs="100">
              <mat-label class="lbl">División</mat-label>
              <mat-select formControlName="division">
                <mat-option value=""></mat-option>
                <mat-option value="1">DIVISIÓN 1</mat-option>
                <mat-option value="2">DIVISIÓN 2</mat-option>
                <mat-option value="3">DIVISIÓN 3</mat-option>
                <mat-option value="4">DIVISIÓN 4</mat-option>
                <mat-option value="5">DIVISIÓN 5</mat-option>
                <mat-option value="6">DIVISIÓN 6</mat-option>
                <mat-option value="6">DIVISIÓN 7</mat-option>
                <mat-option value="6">DIVISIÓN 8</mat-option>
                <mat-option value="6">DIVISIÓN 9</mat-option>
              </mat-select>
              <mat-error *ngIf="form.controls.division.hasError('required')"> Este campo es requerido. </mat-error>
            </mat-form-field>
          </div>
          <mat-error *ngIf="form.errors?.fechas" fxFlex="100">{{ form.errors.fechas }}</mat-error>
          <div fxFlex="100" fxLayout="row" fxLayoutAlign="center start">
            <button [disabled]="form.invalid" mat-raised-button color="primary"><mat-icon>search</mat-icon> Buscar</button>
          </div>
        </form>
      </div>
      <!--  -->
      <app-alumnos-tabla-email [cargando]="cargando" [alumnos]="alumnos"></app-alumnos-tabla-email>
      <div fxLayout="row" fxLayoutAlign="center start" fxLayoutGap="20px">
        <button
          *ngxPermissionsOnly="['ADMIN', 'JEFETALLER']"
          [disabled]="!alumnos || alumnos.length < 1"
          mat-raised-button
          color="accent"
          (click)="enviarEmail()"
        >
          Enviar Email Masivo
        </button>
      </div>
      <div fxLayout="column" class="text-center text-red mat-card mat-elevation-z4 p-24">
        <h3
          style="color: red;
    font-weight: bolder;"
        >
          Los siguientes alumnos no tienen un email registrado para ser notificados
        </h3>
      </div>
      <app-alumnos-tabla-email [cargando]="cargando" [alumnos]="alumnosNoRegistrados" class="w-100-p"></app-alumnos-tabla-email>
    </div>
  `,
  styles: [],
  animations: [designAnimations],
})
export class InasistenciasAlumnosComponent implements OnInit {
  titulo = 'Ver Inasistencias / Enviar Email';
  cargando = false;
  alumnos: any[];
  alumnosNoRegistrados: any[] = [];
  alumnosMerge: any[];
  form: FormGroup;
  rangoHabilitado = false;
  constructor(private _fb: FormBuilder, private _asistenciaService: AsistenciaService, private _alumnoService: AlumnoService) {}

  ngOnInit(): void {
    const today = new Date();
    const horasD = '00:00';
    const horasH = '23:59';
    this.form = this._fb.group(
      {
        fechaDesde: [today, Validators.required],
        fechaHasta: [today],
        horaDesde: [horasD, Validators.required],
        horaHasta: [horasH, Validators.required],
        turno: [null, Validators.required],
        curso: [null],
        division: [null],
      },
      {
        validator: this.restriccionFecha('fechaDesde', 'fechaHasta', 'horaDesde', 'horaHasta'),
      }
    );
  }
  restriccionFecha(desde: string, hasta: string, horaDesde: string, horaHasta: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let result = {};
      const hD = '00:00';
      const hH = '23:59';
      const horasD = group.controls[horaDesde].value ? group.controls[horaDesde].value.toString().split(':') : hD.split(':');
      const horasH = group.controls[horaHasta].value ? group.controls[horaHasta].value.toString().split(':') : hH.split(':');
      if (this.rangoHabilitado) {
        if (group.controls[desde].value && group.controls[hasta].value) {
          let d = moment(group.controls[desde].value).clone().hour(horasD[0]).minutes(horasD[1]);
          let h = moment(group.controls[hasta].value).clone().hour(horasH[0]).minutes(horasH[1]);
          if (h.diff(d) < 0) {
            return {
              fechas: '* La Fecha Hasta no puede ser menor a la Fecha Desde',
            };
          }
        } else {
          result = {
            fechas: '* Ingrese fechas válidas',
          };
        }
      }
      return result;
    };
  }
  habilitarRango() {
    this.rangoHabilitado = !this.rangoHabilitado;
    if (this.rangoHabilitado) {
      this.form.controls.fechaHasta.setValidators([Validators.required]);
    } else {
      this.form.controls.fechaHasta.setValidators([]);
      this.form.controls.fechaHasta.setValue(null);
    }
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
      .buscarInasistencias(
        Number(this.form.controls.division.value),
        Number(this.form.controls.curso.value),
        this.form.controls.turno.value,
        this.form.controls.fechaDesde.value,
        this.rangoHabilitado ? this.form.controls.fechaHasta.value : null
      )
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
      if (x.alumno.adultos) {
        const emailEncontrado = x.alumno.adultos.find((a) => a.email);
        if (emailEncontrado) {
          return x;
        }
      } else {
        // console.log('x', x);
      }
    });
    Swal.fire({
      title: '¿Está seguro de continuar?',
      html: 'Está a punto de enviar un email informando la inasistencia de los alumnos. Como criterio se utilizará al primer tutor/padre/madre que tenga un email registrado.',
      icon: 'warning',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this._alumnoService
          .enviarEmailMasivo(alumnosRegistrados, this.form.controls.fechaDesde.value, this.form.controls.fechaHasta.value)
          .pipe(
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
}
