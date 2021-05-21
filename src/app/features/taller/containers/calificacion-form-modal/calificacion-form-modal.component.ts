import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CalificacionService } from 'app/core/services/calificacion.service';
import { FormasExamenesConst } from 'app/models/constants/forma-examen.const';
import { TiposExamenesConst } from 'app/models/constants/tipo-examen.const';
import { IAlumno } from 'app/models/interface/iAlumno';
import { ICalificacion } from 'app/models/interface/iCalificacion';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import * as moment from 'moment';
import Swal from 'sweetalert2';
@UntilDestroy()
@Component({
  selector: 'app-calificacion-form-modal',
  template: `
    <h1 mat-dialog-title>Evaluar</h1>
    <div mat-dialog-content class="px-24">
      <form
        [formGroup]="form"
        [@animate]="{ value: '*', params: { delay: '50ms', scale: '0.2' } }"
        class="mt-20 p-0"
        fxLayoutAlign="center baseline"
        fxLayout="row wrap"
      >
        <div fxLayout="column" class="w-100-p">
          <!-- <mat-accordion class="mb-12 border">
            <mat-expansion-panel>
              <mat-expansion-panel-header>
                <mat-panel-title> Información </mat-panel-title>
                <mat-panel-description> Profesor/Alumno </mat-panel-description>
              </mat-expansion-panel-header>
              <div fxLayout="column" class="w-100-p">
                <mat-form-field appearance="outline" fxFlex="100">
                  <mat-label>Profesor/a</mat-label>
                  <input matInput class="" readonly formControlName="profesor" />
                </mat-form-field>
                <mat-form-field appearance="outline" fxFlex="100">
                  <mat-label>Alumno/a</mat-label>
                  <input matInput class="" readonly formControlName="alumno" />
                </mat-form-field>
              </div>
            </mat-expansion-panel>
          </mat-accordion> -->

          <!-- tipoExame ============================= -->
          <mat-form-field appearance="outline" fxFlex.gt-xs="45" fxFlex.xs="100">
            <mat-label class="lbl">Tipo Examen</mat-label>
            <mat-select formControlName="tipoExamen">
              <mat-option *ngFor="let tipo of tiposExamenes" [value]="tipo.valor">{{ tipo.nombre }}</mat-option>
            </mat-select>
            <mat-error *ngIf="form.controls.tipoExamen.hasError('required')"> Este campo es requerido. </mat-error>
          </mat-form-field>
          <!-- formaExamen ============================= -->
          <mat-form-field appearance="outline" fxFlex.gt-xs="45" fxFlex.xs="100">
            <mat-label class="lbl">Forma de Examen</mat-label>
            <mat-select formControlName="formaExamen">
              <mat-option *ngFor="let tipo of formasExamenes" [value]="tipo.valor">{{ tipo.nombre }}</mat-option>
            </mat-select>
            <mat-error *ngIf="form.controls.formaExamen.hasError('required')"> Este campo es requerido. </mat-error>
          </mat-form-field>
          <!-- promedioGeneral ============================= -->
          <mat-form-field [fxHide]="ausente" appearance="outline" fxFlex.gt-xs="45" fxFlex.xs="100">
            <mat-label class="lbl">Calificación</mat-label>
            <input matInput type="number" formControlName="promedioGeneral" min="1" max="10" autocomplete="off" />
            <mat-error *ngIf="form.controls.promedioGeneral.hasError('required')"> Este campo es requerido. </mat-error>
            <mat-error
              *ngIf="
                !form.get('promedioGeneral').hasError('required') &&
                (form.get('promedioGeneral').hasError('min') || form.get('promedioGeneral').hasError('max'))
              "
            >
              Entre 0 y 10
            </mat-error>
          </mat-form-field>
          <!-- <mat-checkbox class="mb-12" (click)="permitirAusentar()">Ausente permitido</mat-checkbox> -->
          <div fxFlex.xs="100" fxFlex.gt-xs="45" fxLayout="row wrap" fxLayoutAlign="space-between start" class="border p-12 ">
            <mat-slide-toggle formControlName="ausente" (click)="ausentar($event)">AUSENTE</mat-slide-toggle>
          </div>
          <!-- promedia ============================= -->
          <div [fxHide]="ausente" fxFlex.xs="100" fxFlex.gt-xs="45 " class="border p-12 mb-12">
            <mat-slide-toggle formControlName="promedia">PROMEDIAR</mat-slide-toggle>
          </div>

          <!-- observacion ============================= -->
          <mat-form-field appearance="fill" fxFlexAlign.gt-xs="center" class="w-100-p">
            <mat-label class="lbl">Observaciones</mat-label>
            <textarea
              matInput
              type="text"
              cdkTextareaAutosize
              cdkAutosizeMinRows="3"
              cdkAutosizeMaxRows="6"
              rows="5"
              cols="40"
              formControlName="observaciones"
            ></textarea>
            <mat-error *ngIf="form.get('observaciones').hasError('minlength') || form.get('observaciones').hasError('maxlength')">
              Minimo 4 caracteres y Máximo 50
            </mat-error>
          </mat-form-field>
        </div>
      </form>
    </div>
    <div mat-dialog-actions fxLayout="row wrap" fxLayoutAlign="space-between start" class=" mt-12 w-100-p">
      <button mat-raised-button (click)="cerrar()" color="warn">Cerrar</button>
      <button *ngIf="!isUpdate" mat-raised-button [disabled]="form.invalid" (click)="guardar()" color="primary" [disabled]="cargando">
        Guardar
      </button>
      <button *ngIf="isUpdate" mat-raised-button [disabled]="form.invalid" (click)="actualizar()" [disabled]="cargando" color="primary">
        Actualizar
      </button>
    </div>
  `,
  styles: [],
  animations: [designAnimations],
})
export class CalificacionFormModalComponent implements OnInit, OnDestroy {
  ausente = false;
  cargando = false;
  tiposExamenes = TiposExamenesConst;
  formasExamenes = FormasExamenesConst;
  form: FormGroup;
  planillaTaller: IPlanillaTaller;
  alumno: IAlumno;
  calificacion: ICalificacion;
  today = new Date();
  minimo;
  maximo;
  isUpdate: boolean;
  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<CalificacionFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _calificacionService: CalificacionService
  ) {
    this.planillaTaller = data.planillaTaller;
    this.minimo = new Date(this.planillaTaller.fechaInicio);
    this.maximo = new Date(this.planillaTaller.fechaFinalizacion);
    this.alumno = data.alumno;
    if (data.calificacion) {
      this.isUpdate = true;
      this.calificacion = data.calificacion;
      this.ausente = this.calificacion.ausente;
    }
  }
  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.form = this._fb.group({
      ausente: [this.calificacion ? this.calificacion.ausente : null, []],
      formaExamen: [this.calificacion ? this.calificacion.formaExamen : null, [Validators.required]],
      tipoExamen: [this.calificacion ? this.calificacion.tipoExamen : null, [Validators.required]],
      promedia: [this.calificacion ? this.calificacion.promedia : false, []],
      promedioGeneral: [
        this.calificacion ? this.calificacion.promedioGeneral : null,
        [Validators.required, Validators.min(1), Validators.max(10)],
      ],
      observaciones: [this.calificacion ? this.calificacion.observaciones : '', [Validators.minLength(3), Validators.maxLength(50)]],
      profesor: [this.planillaTaller.profesor.nombreCompleto, [Validators.required]],
      alumno: [this.alumno.nombreCompleto, [Validators.required]],
      planillaTaller: [this.planillaTaller, [Validators.required]],
      fechaCreacion: [new Date(moment().format('YYYY-MM-DD')), Validators.required],
      activo: [true],
    });
  }
  cerrar(): void {
    this.dialogRef.close();
  }
  guardar() {
    if (!this.form.valid) {
      Swal.fire({
        title: 'Error en el Formulario',
        text: 'Verifique de haber ingresado todos los datos requeridos en el formulario de calificacion.',
        icon: 'error',
      });
      this.form.markAllAsTouched();
      return;
    }
    this.cargando = true;

    const calificacion: ICalificacion = {
      ...this.form.value,
      profesor: this.planillaTaller.profesor,
      alumno: this.alumno,
      activo: true,
      fechaCreacion: new Date(),
      ausente: this.ausente,
    };
    this._calificacionService
      .guardarCalificacion(calificacion)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          Swal.fire({
            title: 'Alumno Calificado',
            text: 'La calificación del alumno/a fue guardada',
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
            text: 'No se pudo guardar la calificación. Intentelo nuevamente y si el problema persiste comuniquese con el soporte tecnico',
            icon: 'error',
          });
        }
      );
  }
  actualizar() {
    if (!this.form.valid) {
      Swal.fire({
        title: 'Error en el Formulario',
        text: 'Verifique de haber ingresado todos los datos requeridos en el formulario de calificacion.',
        icon: 'error',
      });
      return;
    }
    this.cargando = true;

    const calificacionForm: ICalificacion = {
      ...this.form.value,
      profesor: this.planillaTaller.profesor,
      alumno: this.alumno,
      activo: true,
      fechaCreacion: new Date(),
      ausente: this.ausente,
    };
    this._calificacionService
      .actualizarCalificacion(this.calificacion._id, calificacionForm)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          Swal.fire({
            title: 'Calificación actualizada',
            text: 'Los datos fueron guardados correctamente',
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
            text: 'No se pudo guardar la calificacion. Intentelo nuevamente y si el problema persiste comuniquese con el soporte tecnico',
            icon: 'error',
          });
        }
      );
  }
  ausentar(evento) {
    this.ausente = !this.ausente;
    if (!this.ausente) {
      //   this.form.controls.promedioGeneral.setValidators([Validators.required, Validators.min(1), Validators.max(10)]);
      this.form.controls.promedioGeneral.setValidators([Validators.required, Validators.min(1), Validators.max(10)]);
      this.form.controls.promedia.setValue(true);
      this.form.controls.promedioGeneral.setValue(null);
    } else {
      // Es Ausente
      this.form.controls.promedia.setValue(false);
      this.form.controls.promedioGeneral.setValidators([]);
      this.form.controls.promedioGeneral.setValue(null);
    }
  }
}
