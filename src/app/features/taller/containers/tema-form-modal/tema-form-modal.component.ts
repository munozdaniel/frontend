import { EventEmitter, Component, Inject, Input, OnChanges, OnDestroy, OnInit, Optional, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TemaService } from 'app/core/services/tema.service';
import { CaracterClaseConst } from 'app/models/constants/caracter-clase.const';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import { ITema } from 'app/models/interface/iTema';
import { CONFIG_PROVIDER } from 'app/shared/config.provider';
import * as moment from 'moment';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
@UntilDestroy()
@Component({
  selector: 'app-tema-form-modal',
  template: `
    <div fxLayout="row wrap" fxLayoutAlign="space-between start" class="p-12">
      <div>
        <h1 mat-dialog-title>{{ tema && tema.nroClase ? 'Editar clase N° ' + tema.nroClase : 'Completar tema de la clase' }}</h1>
        <h3>{{ fechaNombre | diaDeLaSemana }} {{ tema?._id }}</h3>
      </div>
      <button color="warn" mat-raised-button (click)="sinDictar()">SIN DICTAR</button>
    </div>
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
          <!-- <mat-form-field appearance="outline" fxFlex.gt-xs="45" fxFlex.xs="100">
            <mat-label class="lbl">Nro Clase</mat-label>
            <input matInput type="number" formControlName="nroClase" min="0" max="10" autocomplete="off" readonly />
            <mat-error *ngIf="form.controls.nroClase.hasError('required')"> Este campo es requerido. </mat-error>
            <mat-error
              *ngIf="
                !form.get('nroClase').hasError('required') && (form.get('nroClase').hasError('min') || form.get('nroClase').hasError('max'))
              "
            >
              Entre 0 y 100
            </mat-error>
          </mat-form-field> -->
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
        <button *ngIf="isModal" mat-raised-button ngClass.xs="" class="mt-8 w-100-p" fxFlex.xs="100" (click)="cerrar()" color="warn">
          Cerrar
        </button>
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
  styles: [
    `
      body.theme-default .mat-input-element:disabled,
      body.theme-default .mat-form-field-type-mat-native-select.mat-form-field-disabled .mat-form-field-infix::after {
        color: rgb(187 9 9);
      }
    `,
  ],
  animations: [designAnimations],
  providers: CONFIG_PROVIDER,
})
export class TemaFormModalComponent implements OnInit, OnDestroy, OnChanges {
  caracterClases = CaracterClaseConst;
  cargando = false;
  form: FormGroup;
  @Input() isUpdate?: boolean;
  @Input() planillaTaller?: IPlanillaTaller;
  @Input() tema?: ITema;
  @Output() retActualizarLibro = new EventEmitter<boolean>();
  minimo;
  maximo;
  isModal = false;
  fechaNombre: string;
  constructor(
    private _fb: FormBuilder,
    private _temaService: TemaService,
    @Optional() public dialogRef: MatDialogRef<TemaFormModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.isModal = true;
      if (data.planillaTaller) {
        this.planillaTaller = data.planillaTaller;
        this.minimo = new Date(this.planillaTaller.fechaInicio);
        this.maximo = new Date(this.planillaTaller.fechaFinalizacion);
      }

      if (data.tema) {
        this.isUpdate = true;
        this.tema = data.tema;
      }
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.tema && changes.tema.currentValue) {
      this.actualizarForm();
    }
  }
  ngOnDestroy(): void {}
  actualizarForm() {
    if (this.form) {
      this.form.reset();
      this.fechaNombre = moment.utc(this.tema.fecha).format('dddd');
      this.form.patchValue(this.tema);
      this.form.controls.fecha.setValue(moment.utc(this.tema.fecha));
    } else {
      setTimeout(() => {
        this.actualizarForm();
      }, 1000);
    }
  }
  ngOnInit(): void {
    if (!this.isModal) {
      this.minimo = new Date(this.planillaTaller.fechaInicio);
      this.maximo = new Date(this.planillaTaller.fechaFinalizacion);
    }
    const fechaHoy = moment();
    let f = fechaHoy;
    if (!fechaHoy.isSameOrBefore(moment.utc(this.planillaTaller.fechaFinalizacion))) {
      f = moment.utc(this.planillaTaller.fechaFinalizacion);
    }
    this.form = this._fb.group({
      fecha: [{ value: this.tema ? moment.utc(this.tema.fecha) : f, disabled: true }, [Validators.required]],
      temaDelDia: [this.tema ? this.tema.temaDelDia : null, [Validators.required, Validators.minLength(4), Validators.maxLength(100)]],
      tipoDesarrollo: [
        this.tema ? this.tema.tipoDesarrollo : null,
        [Validators.required, Validators.minLength(4), Validators.maxLength(100)],
      ],
      temasProximaClase: [this.tema ? this.tema.temasProximaClase : null, [Validators.minLength(4), Validators.maxLength(100)]],
      //   nroClase: [this.tema ? this.tema.nroClase : null, [Validators.min(0), Validators.max(100)]],
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
            if (this.dialogRef) {
              this.dialogRef.close(true);
            } else {
              this.retActualizarLibro.emit(true);
            }
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
      _id: this.tema._id,
      fecha: this.form.controls.fecha.value,
      activo: true,
      fechaCreacion: new Date(),
    };
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
          this.tema._id = datos.tema._id;
          this.cargando = false;
          if (this.dialogRef) {
            this.dialogRef.close(true);
          } else {
            this.retActualizarLibro.emit(true);
          }
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
  sinDictar() {
    const tema: ITema = {
      _id: this.tema._id,
      temaNro: this.tema.temaNro,
      planillaTaller: this.planillaTaller,
      fecha: this.tema.fecha,
      temaDelDia: null,
      tipoDesarrollo: null,
      temasProximaClase: null,
      nroClase: null,
      unidad: null,
      caracterClase: 'SIN DICTAR',
      observacionJefe: this.tema.observacionJefe,
      activo: this.tema.activo,
    };
    Swal.fire({
      title: '¿Está seguro de continuar?',
      html:
        'Se eliminarán los datos que hayan sido almacenados anteriormente para la fecha: ' +
        moment.utc(this.tema.fecha).format('DD/MM/YYYY'),
      icon: 'warning',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
        required: 'true',
        placeholder: 'Observacion',
      },
      preConfirm: (observacionJefe) => {
        this.tema.observacionJefe = observacionJefe;
        return this._temaService.actualizarTema(this.tema._id, tema).pipe(
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
            text: 'La planilla de taller ha sido actualizada',
            icon: 'success',
          });
          this.form.reset();
          this.retActualizarLibro.emit(true);
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
