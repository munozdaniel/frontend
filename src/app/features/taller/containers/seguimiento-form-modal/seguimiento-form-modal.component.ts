import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { designAnimations } from '@design/animations';
import { untilDestroyed } from '@ngneat/until-destroy';
import { SeguimientoAlumnoService } from 'app/core/services/seguimientoAlumno.service';
import { IAlumno } from 'app/models/interface/iAlumno';
import { ICicloLectivo } from 'app/models/interface/iCicloLectivo';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import { ISeguimientoAlumno } from 'app/models/interface/iSeguimientoAlumno';
import { CONFIG_PROVIDER } from 'app/shared/config.provider';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-seguimiento-form-modal',
  template: `
    <h1 mat-dialog-title>Seguimiento de {{ alumno?.nombreCompleto }}</h1>
    <div mat-dialog-content class="px-24">
      <form
        [formGroup]="form"
        [@animate]="{ value: '*', params: { delay: '50ms', scale: '0.2' } }"
        class="mt-20 p-0"
        fxLayoutAlign="center baseline"
        fxLayout="row wrap"
      >
        <div fxLayout.xs="column" class="w-100-p" fxLayout.gt-xs="row wrap" fxLayoutAlign.gt-xs="space-between start">
          <!-- Fecha -->
          <mat-form-field appearance="outline" fxFlex.xs="100" fxFlex.gt-xs="45">
            <mat-label>Fecha</mat-label>
            <input [max]="maximo" [min]="minimo" autocomplete="off" matInput [matDatepicker]="picker" formControlName="fecha" />
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
            <mat-error *ngIf="form?.controls.fecha.hasError('required')"> Este campo es requerido. </mat-error>
          </mat-form-field>
          <!-- tipoSeguimiento -->
          <mat-form-field appearance="outline" fxFlex.gt-xs="45" fxFlex.xs="100">
            <mat-label class="lbl">Tema del Día</mat-label>
            <input matInput type="text" formControlName="tipoSeguimiento" maxlength="100" minlength="4" autocomplete="off" />
            <mat-error *ngIf="form.controls.tipoSeguimiento.hasError('required')"> Este campo es requerido. </mat-error>
            <mat-error
              *ngIf="
                !form.get('tipoSeguimiento').hasError('required') &&
                (form.get('tipoSeguimiento').hasError('minlength') || form.get('tipoSeguimiento').hasError('maxlength'))
              "
            >
              Entre 4 y 100 caracteres
            </mat-error>
          </mat-form-field>
          <!-- resuelto -->
          <div *ngIf="isUpdate" fxFlex.xs="100" fxFlex.gt-xs="45" class="border p-12 mb-12">
            <mat-slide-toggle formControlName="resuelto">{{ form.controls.resuelto.value ? 'RESUELTO' : 'NO RESUELTO' }}</mat-slide-toggle>
          </div>

          <!-- observacion ============================= -->
          <mat-form-field appearance="fill" fxFlexAlign.gt-xs="center" class="w-100-p">
            <mat-label class="lbl">Observación</mat-label>
            <textarea
              matInput
              type="text"
              cdkTextareaAutosize
              cdkAutosizeMinRows="3"
              cdkAutosizeMaxRows="6"
              rows="5"
              cols="40"
              formControlName="observacion"
            ></textarea>
            <mat-error *ngIf="form.get('observacion').hasError('minlength') || form.get('observacion').hasError('maxlength')">
              Minimo 4 caracteres y Máximo 100
            </mat-error>
          </mat-form-field>
          <!-- observacion ============================= -->
          <mat-form-field appearance="fill" fxFlexAlign.gt-xs="center" class="w-100-p">
            <mat-label class="lbl">Observación</mat-label>
            <textarea
              matInput
              type="text"
              cdkTextareaAutosize
              cdkAutosizeMinRows="3"
              cdkAutosizeMaxRows="6"
              rows="5"
              cols="40"
              formControlName="observacion"
            ></textarea>
            <mat-error *ngIf="form.get('observacion').hasError('minlength') || form.get('observacion').hasError('maxlength')">
              Minimo 4 caracteres y Máximo 100
            </mat-error>
          </mat-form-field>
          <!-- observacion ============================= -->
          <mat-form-field appearance="fill" fxFlexAlign.gt-xs="center" class="w-100-p">
            <mat-label class="lbl">Segunda Observación</mat-label>
            <textarea
              matInput
              type="text"
              cdkTextareaAutosize
              cdkAutosizeMinRows="3"
              cdkAutosizeMaxRows="6"
              rows="5"
              cols="40"
              formControlName="observacion2"
            ></textarea>
            <mat-error *ngIf="form.get('observacion2').hasError('minlength') || form.get('observacion2').hasError('maxlength')">
              Minimo 4 caracteres y Máximo 100
            </mat-error>
          </mat-form-field>
          <!-- observacionJefe ============================= -->
          <mat-form-field appearance="fill" fxFlexAlign.gt-xs="center" class="w-100-p">
            <mat-label class="lbl"> Observación Jefe de Taller</mat-label>
            <textarea
              matInput
              type="text"
              cdkTextareaAutosize
              cdkAutosizeMinRows="3"
              cdkAutosizeMaxRows="6"
              rows="5"
              cols="40"
              formControlName="observacionJefe"
            ></textarea>
            <mat-error *ngIf="form.get('observacionJefe').hasError('minlength') || form.get('observacionJefe').hasError('maxlength')">
              Minimo 4 caracteres y Máximo 100
            </mat-error>
          </mat-form-field>
        </div>
      </form>
      <div fxLayout="row wrap" fxLayoutAlign="space-between start" class="mt-12">
        <button mat-raised-button ngClass.xs="" class="mt-8 w-100-p" fxFlex.xs="100" (click)="cerrar()" color="warn">Cerrar</button>
        <button
          [disabled]="cargando"
          *ngIf="!isUpdate"
          mat-raised-button
          [disabled]="form.invalid"
          ngClass.xs=""
          class="mt-8 w-100-p"
          fxFlex.xs="100"
          (click)="guardar()"
          color="primary"
        >
          Guardar
        </button>
        <button
          *ngIf="isUpdate"
          mat-raised-button
          [disabled]="form.invalid"
          ngClass.xs=""
          class="mt-8 w-100-p"
          fxFlex.xs="100"
          [disabled]="cargando"
          (click)="actualizar()"
          color="primary"
        >
          Actualizar
        </button>
      </div>
    </div>
  `,
  styles: [],
  animations: [designAnimations],
  providers: CONFIG_PROVIDER,
})
export class SeguimientoFormModalComponent implements OnInit {
  cicloLectivo: ICicloLectivo;
  alumno: IAlumno;
  cargando = false;
  form: FormGroup;
  isUpdate: boolean;
  planillaTaller: IPlanillaTaller;
  seguimiento: ISeguimientoAlumno;
  minimo;
  maximo;
  constructor(
    private _fb: FormBuilder,
    private _seguimientoAlumnoService: SeguimientoAlumnoService,
    public dialogRef: MatDialogRef<SeguimientoFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.planillaTaller = data.planillaTaller;
    this.minimo = new Date(this.planillaTaller.fechaInicio);
    this.maximo = new Date(this.planillaTaller.fechaFinalizacion);
    this.alumno = data.alumno;
    this.cicloLectivo = this.planillaTaller.cicloLectivo;
    if (data.seguimiento) {
      this.isUpdate = true;
      this.seguimiento = data.seguimiento;
    }
  }
  ngOnDestroy(): void {}
  ngOnInit(): void {
    const fechaHoy = moment();
    let f = fechaHoy;
    if (!fechaHoy.isSameOrBefore(moment(this.planillaTaller.fechaFinalizacion))) {
      f = moment(this.planillaTaller.fechaFinalizacion);
    }
    this.form = this._fb.group({
      fecha: [this.seguimiento ? this.seguimiento.fecha : f, [Validators.required]],
      alumno: [this.alumno, [Validators.required]],
      planillaTaller: [this.planillaTaller, [Validators.required]],
      cicloLectivo: [this.cicloLectivo, [Validators.required]],
      tipoSeguimiento: [
        this.seguimiento ? this.seguimiento.tipoSeguimiento : null,
        [Validators.required, Validators.minLength(7), Validators.maxLength(100)],
      ],
      resuelto: [this.seguimiento ? this.seguimiento.resuelto : false, [Validators.required]],
      observacion: [
        this.seguimiento ? this.seguimiento.observacion : null,
        [Validators.required, Validators.minLength(7), Validators.maxLength(100)],
      ],
      observacion2: [this.seguimiento ? this.seguimiento.observacion2 : null, [Validators.minLength(7), Validators.maxLength(100)]],
      observacionJefe: [this.seguimiento ? this.seguimiento.observacionJefe : null, [Validators.minLength(7), Validators.maxLength(100)]],
      fechaCreacion: [new Date(moment().format('YYYY-MM-DD')), Validators.required],
      activo: [this.seguimiento ? this.seguimiento.activo : true, [Validators.required]],
    });
  }
  cerrar(): void {
    this.dialogRef.close();
  }
  guardar() {
    if (!this.form.valid) {
      Swal.fire({
        title: 'Error en el Formulario',
        text: 'Verifique de haber ingresado todos los datos requeridos en el formulario de seguimiento.',
        icon: 'error',
      });
      return;
    }
    this.cargando = true;

    const seguimiento: ISeguimientoAlumno = {
      ...this.form.value,
      activo: true,
      fechaCreacion: new Date(),
    };
    this._seguimientoAlumnoService
      .agregarSeguimientoAlumno(seguimiento)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          Swal.fire({
            title: 'Tema Agregado',
            text: 'Un nuevo seguimiento fue agregado al libro',
            icon: 'success',
          });
          this.dialogRef.close(true);
          this.cargando = false;
        },
        (error) => {
          this.cargando = false;
          console.log('[ERROR]', error);
          Swal.fire({
            title: 'Ocurrió un error',
            text: 'No se pudo guardar el seguimiento. Intentelo nuevamente y si el problema persiste comuniquese con el soporte tecnico',
            icon: 'error',
          });
        }
      );
  }
  actualizar() {
    if (!this.form.valid) {
      Swal.fire({
        title: 'Error en el Formulario',
        text: 'Verifique de haber ingresado todos los datos requeridos en el formulario de seguimiento.',
        icon: 'error',
      });
      return;
    }
    this.cargando = true;

    const seguimientoForm: ISeguimientoAlumno = {
      ...this.form.value,
      activo: true,
      fechaCreacion: new Date(),
    };
    console.log('seguimiento', seguimientoForm);
    this._seguimientoAlumnoService
      .actualizarSeguimientoAlumno(this.seguimiento._id, seguimientoForm)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          Swal.fire({
            title: 'Tema actualizado',
            text: 'Los datos fueron actualizados correctamente',
            icon: 'success',
          });
          this.cargando = false;
          this.dialogRef.close(true);
        },
        (error) => {
          this.cargando = false;
          console.log('[ERROR]', error);
          Swal.fire({
            title: 'Ocurrió un error',
            text: 'No se pudo guardar el seguimiento. Intentelo nuevamente y si el problema persiste comuniquese con el soporte tecnico',
            icon: 'error',
          });
        }
      );
  }
}
