import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TemaService } from 'app/core/services/tema.service';
import { CaracterClaseConst } from 'app/models/constants/caracter-clase.const';
import { ICalificacion } from 'app/models/interface/iCalificacion';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import { ITema } from 'app/models/interface/iTema';
import { CONFIG_PROVIDER } from 'app/shared/config.provider';
import * as moment from 'moment';
import Swal from 'sweetalert2';
@UntilDestroy()
@Component({
  selector: 'app-tema-form-modal',
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
        <div fxLayout.xs="column" class="w-100-p" fxLayout.gt-xs="row wrap" fxLayoutAlign.gt-xs="space-between start">
          <!-- Fecha -->
          <mat-form-field appearance="outline" fxFlex.xs="100" fxFlex.gt-xs="45">
            <mat-label>Fecha</mat-label>
            <input [max]="maximo" [min]="minimo" autocomplete="off" matInput [matDatepicker]="picker" formControlName="fecha" />
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
            <mat-error *ngIf="form?.controls.fecha.hasError('required')"> Este campo es requerido. </mat-error>
          </mat-form-field>
          <!-- TemaDelDia -->
          <mat-form-field appearance="outline" fxFlex.gt-xs="45" fxFlex.xs="100">
            <mat-label class="lbl">Tema del Día</mat-label>
            <input matInput type="text" formControlName="temaDelDia" maxlength="100" minlength="4" autocomplete="off" />
            <mat-error *ngIf="form.controls.temaDelDia.hasError('required')"> Este campo es requerido. </mat-error>
            <mat-error
              *ngIf="
                !form.get('temaDelDia').hasError('required') &&
                (form.get('temaDelDia').hasError('minlength') || form.get('temaDelDia').hasError('maxlength'))
              "
            >
              Entre 4 y 100 caracteres
            </mat-error>
          </mat-form-field>
          <!-- tipoDesarrollo ============================= -->
          <mat-form-field appearance="outline" fxFlex.gt-xs="45" fxFlex.xs="100">
            <mat-label class="lbl">Tipo de Desarrollo</mat-label>
            <input matInput type="text" formControlName="tipoDesarrollo" maxlength="100" minlength="4" autocomplete="off" />
            <mat-error *ngIf="form.controls.tipoDesarrollo.hasError('required')"> Este campo es requerido. </mat-error>
            <mat-error
              *ngIf="
                !form.get('tipoDesarrollo').hasError('required') &&
                (form.get('tipoDesarrollo').hasError('minlength') || form.get('tipoDesarrollo').hasError('maxlength'))
              "
            >
              Entre 4 y 100 caracteres
            </mat-error>
          </mat-form-field>
          <!-- temasProximaClase ============================= -->
          <mat-form-field appearance="outline" fxFlex.gt-xs="45" fxFlex.xs="100">
            <mat-label class="lbl">Tema de la próxima clase</mat-label>
            <input matInput type="text" formControlName="temasProximaClase" maxlength="100" minlength="4" autocomplete="off" />
            <mat-error *ngIf="form.controls.temasProximaClase.hasError('required')"> Este campo es requerido. </mat-error>
            <mat-error
              *ngIf="
                !form.get('temasProximaClase').hasError('required') &&
                (form.get('temasProximaClase').hasError('minlength') || form.get('temasProximaClase').hasError('maxlength'))
              "
            >
              Entre 4 y 100 caracteres
            </mat-error>
          </mat-form-field>

          <!-- nroClase ============================= -->
          <mat-form-field appearance="outline" fxFlex.gt-xs="45" fxFlex.xs="100">
            <mat-label class="lbl">Nro Clase</mat-label>
            <input matInput type="number" formControlName="nroClase" min="0" max="10" autocomplete="off" />
            <mat-error *ngIf="form.controls.nroClase.hasError('required')"> Este campo es requerido. </mat-error>
            <mat-error
              *ngIf="
                !form.get('nroClase').hasError('required') && (form.get('nroClase').hasError('min') || form.get('nroClase').hasError('max'))
              "
            >
              Entre 0 y 100
            </mat-error>
          </mat-form-field>
          <!-- unidad ============================= -->
          <mat-form-field appearance="outline" fxFlex.gt-xs="45" fxFlex.xs="100">
            <mat-label class="lbl">Unidad</mat-label>
            <input matInput type="number" formControlName="unidad" min="0" max="10" autocomplete="off" />
            <mat-error *ngIf="form.controls.unidad.hasError('required')"> Este campo es requerido. </mat-error>
            <mat-error
              *ngIf="!form.get('unidad').hasError('required') && (form.get('unidad').hasError('min') || form.get('unidad').hasError('max'))"
            >
              Entre 0 y 100
            </mat-error>
          </mat-form-field>
          <!-- caracterClase ============================= -->
          <mat-form-field appearance="outline" fxFlex.gt-xs="45" fxFlex.xs="100">
            <mat-label class="lbl">Caracter Clase</mat-label>
            <mat-select formControlName="caracterClase">
              <mat-option *ngFor="let caracter of caracterClases" [value]="caracter.valor">{{ caracter.nombre }}</mat-option>
            </mat-select>
            <mat-error *ngIf="form.controls.caracterClase.hasError('required')"> Este campo es requerido. </mat-error>
          </mat-form-field>
          <!-- observacionJefe ============================= -->
          <mat-form-field appearance="fill" fxFlexAlign.gt-xs="center" class="w-100-p">
            <mat-label class="lbl">Observación Jefe Taller</mat-label>
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
export class TemaFormModalComponent implements OnInit, OnDestroy {
  caracterClases = CaracterClaseConst;
  cargando = false;
  form: FormGroup;
  isUpdate: boolean;
  planillaTaller: IPlanillaTaller;
  tema: ITema;
  minimo;
  maximo;
  constructor(
    private _fb: FormBuilder,
    private _temaService: TemaService,
    public dialogRef: MatDialogRef<TemaFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.planillaTaller = data.planillaTaller;
    this.minimo = new Date(this.planillaTaller.fechaInicio);
    this.maximo = new Date(this.planillaTaller.fechaFinalizacion);
    if (data.tema) {
      this.isUpdate = true;
      this.tema = data.tema;
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
      fecha: [this.tema ? this.tema.fecha : f, [Validators.required]],
      temaDelDia: [this.tema ? this.tema.temaDelDia : null, [Validators.required, Validators.minLength(4), Validators.maxLength(100)]],
      tipoDesarrollo: [
        this.tema ? this.tema.tipoDesarrollo : null,
        [Validators.required, Validators.minLength(4), Validators.maxLength(100)],
      ],
      temasProximaClase: [this.tema ? this.tema.temasProximaClase : null, [Validators.minLength(4), Validators.maxLength(100)]],
      nroClase: [this.tema ? this.tema.nroClase : null, [Validators.min(0), Validators.max(100)]],
      unidad: [this.tema ? this.tema.unidad : null, [Validators.required, Validators.min(0), Validators.max(100)]],
      caracterClase: [
        this.tema ? this.tema.caracterClase : null,
        [Validators.required, Validators.minLength(7), Validators.maxLength(100)],
      ],
      planillaTaller: [this.planillaTaller, [Validators.required]],
      observacionJefe: [this.tema ? this.tema.observacionJefe : null, [Validators.minLength(4), Validators.maxLength(100)]],
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
        text: 'Verifique de haber ingresado todos los datos requeridos en el formulario de tema.',
        icon: 'error',
      });
      return;
    }
    this.cargando = true;

    const tema: ITema = {
      ...this.form.value,
      activo: true,
      fechaCreacion: new Date(),
    };
    this._temaService
      .guardarTema(tema)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          if (datos.success) {
            Swal.fire({
              title: 'Tema agregado',
              text: 'Los datos fueron guardados correctamente',
              icon: 'success',
            });
            this.dialogRef.close(true);
          } else {
            Swal.fire({
              title: 'Tema no guardado',
              text: datos.message,
              icon: 'warning',
            });
          }

         
          this.cargando = false;
        },
        (error) => {
          this.cargando = false;
          console.log('[ERROR]', error);
          Swal.fire({
            title: 'Ocurrió un error',
            text: 'No se pudo guardar el tema. Intentelo nuevamente y si el problema persiste comuniquese con el soporte tecnico',
            icon: 'error',
          });
        }
      );
  }
  actualizar() {
    if (!this.form.valid) {
      Swal.fire({
        title: 'Error en el Formulario',
        text: 'Verifique de haber ingresado todos los datos requeridos en el formulario de tema.',
        icon: 'error',
      });
      return;
    }
    this.cargando = true;

    const temaForm: ITema = {
      ...this.form.value,
      activo: true,
      fechaCreacion: new Date(),
    };
    console.log('tema', temaForm);
    this._temaService
      .actualizarTema(this.tema._id, temaForm)
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
            text: 'No se pudo guardar el tema. Intentelo nuevamente y si el problema persiste comuniquese con el soporte tecnico',
            icon: 'error',
          });
        }
      );
  }
}
