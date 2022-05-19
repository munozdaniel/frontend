import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, throwToolbarMixedModesError } from '@angular/material';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthService } from 'app/core/auth/auth.service';
import { CicloLectivoService } from 'app/core/services/ciclo-lectivo.service';
import { PlanillaTallerService } from 'app/core/services/planillaTaller.service';
import { SeguimientoAlumnoService } from 'app/core/services/seguimientoAlumno.service';
import { DescripcionSeguimiento } from 'app/models/constants/descripcion-seguimiento.const';
import { RolConst } from 'app/models/constants/rol.enum';
import { IAlumno } from 'app/models/interface/iAlumno';
import { ICicloLectivo } from 'app/models/interface/iCicloLectivo';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import { ISeguimientoAlumno } from 'app/models/interface/iSeguimientoAlumno';
import { IUsuario } from 'app/models/interface/iUsuario';
import { CONFIG_PROVIDER } from 'app/shared/config.provider';
import * as moment from 'moment';
import Swal from 'sweetalert2';
@UntilDestroy()
@Component({
  selector: 'app-seguimiento-form-modal',
  template: ` <div fxLayout="row wrap" fxLayoutAlign="space-between baseline">
      <h1 mat-dialog-title>Seguimiento de {{ alumno?.nombreCompleto }}</h1>
      <!-- <mat-checkbox color="warn" *ngxPermissionsOnly="['PROFESOR']" #checkbox (change)="showOptions(checkbox.checked)" [value]="esLeido">
        Marcar como leído
      </mat-checkbox> -->
    </div>
    <div mat-dialog-content class="py-12 px-24 border">
      <!-- <div fxLayout="row" fxLayoutAlign="center start">
        <button mat-raised-button color="accent" (click)="buscarPlanilla()">
          <mat-icon>search</mat-icon> <span>Asignar Planilla</span>
        </button>
      </div> -->
      <div
        fxLayout="row wrap"
        fxLayoutAlign="space-between start"
        style="    border-bottom: 1px solid gray;
    padding-bottom: 10px;"
      >
        <div
          *ngIf="seguimiento?.creadoPor"
          fxFlex.xs="100"
          fxFlex.gt-xs="45"
          fxLayout="row"
          fxLayoutAlign="start center"
          fxLayoutGap="10px"
        >
          <strong>Creado Por:</strong>
          <span>{{ seguimiento.creadoPor?.apellido + ' ' + seguimiento.creadoPor?.nombre }}</span>
        </div>
        <div
          *ngIf="seguimiento?.modificadoPor"
          fxFlex.xs="100"
          fxFlex.gt-xs="45"
          fxLayout="row"
          fxLayoutAlign="start center"
          fxLayoutGap="10px"
        >
          <strong>Modificado Por:</strong>
          <span>{{ seguimiento.modificadoPor?.apellido + ' ' + seguimiento.modificadoPor?.nombre }}</span>
        </div>
        <div
          *ngIf="seguimiento?.planillaTaller"
          fxFlex.xs="100"
          fxFlex.gt-xs="45"
          fxLayout="row"
          fxLayoutAlign="start center"
          fxLayoutGap="10px"
        >
          <strong>Curso:</strong>
          <span>{{ seguimiento.planillaTaller?.curso.curso + '° AÑO ' + seguimiento.planillaTaller?.curso.division + '° DIV ' }}</span>
          <span *ngIf="seguimiento.planillaTaller?.curso.comision">{{ 'COM. ' + seguimiento.planillaTaller?.curso.comision }}</span>
        </div>
        <div
          *ngIf="seguimiento?.planillaTaller"
          fxFlex.xs="100"
          fxFlex.gt-xs="45"
          fxLayout="row"
          fxLayoutAlign="start center"
          fxLayoutGap="10px"
        >
          <strong>Profesor:</strong>
          <span>{{ seguimiento.planillaTaller.profesor?.nombreCompleto }}</span>
        </div>
        <div
          *ngIf="seguimiento?.planillaTaller"
          fxFlex.xs="100"
          fxFlex.gt-xs="45"
          fxLayout="row"
          fxLayoutAlign="start center"
          fxLayoutGap="10px"
        >
          <strong>Asignatura:</strong>
          <span>{{ seguimiento.planillaTaller.asignatura?.detalle }}</span>
        </div>
      </div>
      <div fxLayout="row wrap" fxLayoutAlign="space-between start">
        <form
          [formGroup]="form"
          [@animate]="{ value: '*', params: { delay: '50ms', scale: '0.2' } }"
          class="mt-20 p-0"
          fxLayoutAlign="center baseline"
          fxLayout="row wrap"
          fxFlex.xs="100"
          [fxFlex.gt-xs]="habilitarBusqueda ? 45 : 100"
        >
          <div fxLayout.xs="column" class="w-100-p" fxLayout.gt-xs="row wrap" fxLayoutAlign.gt-xs="space-between start">
            <!-- Fecha -->
            <mat-form-field appearance="outline" fxFlex.xs="100" fxFlex.gt-xs="45">
              <mat-label>Fecha</mat-label>
              <input [max]="maximo" autocomplete="off" matInput [matDatepicker]="picker" formControlName="fecha" />
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-error *ngIf="form?.controls.fecha.hasError('required')"> Este campo es requerido. </mat-error>
            </mat-form-field>
            <!-- tipoSeguimiento -->
            <mat-form-field appearance="outline" fxFlex.gt-xs="45" fxFlex.xs="100">
              <mat-label class="lbl">Tipo de Seguimiento</mat-label>
              <mat-select formControlName="tipoSeguimiento">
                <mat-option *ngFor="let tipo of descripcionSeguimientos" [value]="tipo">{{ tipo }}</mat-option>
              </mat-select>
              <mat-error *ngIf="form.controls.tipoSeguimiento.hasError('required')"> Este campo es requerido. </mat-error>
            </mat-form-field>

            <!-- resuelto -->
            <div *ngIf="isUpdate" fxFlex.xs="100" fxFlex.gt-xs="100" class="border p-12 mb-12">
              <mat-slide-toggle formControlName="resuelto">{{
                form.controls.resuelto.value ? 'RESUELTO' : 'NO RESUELTO'
              }}</mat-slide-toggle>
            </div>

            <!-- observacion ============================= -->
            <mat-form-field appearance="fill" fxFlexAlign.gt-xs="center" fxFlex.gt-xs="45" fxFlex.xs="100">
              <mat-label class="lbl">Observación</mat-label>
              <textarea
                matInput
                type="text"
                cdkTextareaAutosize
                cdkAutosizeMinRows="3"
                cdkAutosizeMaxRows="6"
                rows="3"
                cols="40"
                formControlName="observacion"
              ></textarea>
              <mat-error *ngIf="form.get('observacion').hasError('minlength') || form.get('observacion').hasError('maxlength')">
                Minimo 7 caracteres y Máximo 300
              </mat-error>
            </mat-form-field>
            <!-- observacion ============================= -->
            <mat-form-field appearance="fill" fxFlexAlign.gt-xs="center" fxFlex.gt-xs="45" fxFlex.xs="100">
              <mat-label class="lbl">Segunda Observación</mat-label>
              <textarea
                matInput
                type="text"
                cdkTextareaAutosize
                cdkAutosizeMinRows="3"
                cdkAutosizeMaxRows="6"
                rows="3"
                cols="40"
                formControlName="observacion2"
              ></textarea>
              <mat-error *ngIf="form.get('observacion2').hasError('minlength') || form.get('observacion2').hasError('maxlength')">
                Minimo 7 caracteres y Máximo 300
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
                rows="3"
                cols="40"
                formControlName="observacionJefe"
              ></textarea>
              <mat-error *ngIf="form.get('observacionJefe').hasError('minlength') || form.get('observacionJefe').hasError('maxlength')">
                Minimo 7 caracteres y Máximo 300
              </mat-error>
            </mat-form-field>
          </div>
        </form>
        <!-- TABLA ================================ -->
        <div *ngIf="habilitarBusqueda" fxFlex.xs="100" fxFlex.gt-xs="45" fxLayout="column">
          <div>
            <span>Seleccione una planilla para vincular el seguimiento del alumno con el profesor para que sea notificado.</span>
          </div>
          <app-planilla-seguimiento
            class=""
            [cargando]="cargandoPlanillas"
            [planillas]="planillasTaller"
            (retPlanilla)="setPlanilla($event)"
          >
          </app-planilla-seguimiento>
        </div>
        <!-- ================================ -->
      </div>
    </div>
    <div mat-dialog-actionsfxLayout="row wrap" fxLayoutAlign="space-between start" class="mt-12">
      <button mat-raised-button ngClass.xs="" class="mt-8 " fxFlex.xs="100" (click)="cerrar()" color="warn">Cerrar</button>
      <button
        [disabled]="cargando"
        *ngIf="!isUpdate"
        mat-raised-button
        [disabled]="form.invalid"
        ngClass.xs=""
        class="mt-8"
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
        class="mt-8 "
        fxFlex.xs="100"
        [disabled]="cargando"
        (click)="actualizar()"
        color="primary"
      >
        Actualizar
      </button>
    </div>`,
  styles: [],
  animations: [
    designAnimations,
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  providers: CONFIG_PROVIDER,
})
export class SeguimientoFormModalComponent implements OnInit {
  esLeido = false;
  //
  descripcionSeguimientos = DescripcionSeguimiento;
  cicloLectivo: ICicloLectivo; // solo va a tner datos cuando venga por planilla
  alumno: IAlumno;
  cargando = false;
  form: FormGroup;
  isUpdate: boolean;
  planillaTaller: IPlanillaTaller;
  planillasTaller: IPlanillaTaller[];
  seguimiento: ISeguimientoAlumno;
  maximo;
  ciclosLectivos: ICicloLectivo[];
  usuario: IUsuario;
  habilitarBusqueda = false;
  cargandoPlanillas = false;
  constructor(
    private _fb: FormBuilder,
    private _planillaTallerService: PlanillaTallerService,
    private _seguimientoAlumnoService: SeguimientoAlumnoService,
    private _cicloLectivoService: CicloLectivoService,
    private _authService: AuthService,
    public dialogRef: MatDialogRef<SeguimientoFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this._authService.currentUser$.pipe(untilDestroyed(this)).subscribe((datos) => {
      this.usuario = { ...datos };
    });
    if (data.planillaTaller) {
      this.planillaTaller = data.planillaTaller;
      this.maximo = new Date(this.planillaTaller.fechaFinalizacion);
      this.cicloLectivo = this.planillaTaller.cicloLectivo;
    }
    // if (data.ciclosLectivos) {
    //   this.ciclosLectivos = data.ciclosLectivos;
    // }

    this.alumno = data.alumno;
    if (data.buscarPlanilla) {
      this.habilitarBusqueda = data.buscarPlanilla;
      this.obtenerPlanillas();
    }
    if (data.seguimiento) {
      this.isUpdate = true;
      this.seguimiento = data.seguimiento;
      //   if (data.marcarLeido) {
      //     this.marcarLeido();
      //   }
    }
  }
  //   marcarLeido() {
  //     this.seguimiento.leido = true;
  //     this._seguimientoAlumnoService
  //       .actualizarSeguimientoAlumno(this.seguimiento._id, this.seguimiento)
  //       .pipe(untilDestroyed(this))
  //       .subscribe(
  //         (datos) => {
  //           this._seguimientoAlumnoService.stopPolling.next();
  //           this._seguimientoAlumnoService.poolingSeguimientos(this.usuario.email);
  //         },
  //         (error) => {
  //           console.log('[ERROR]', error);
  //         }
  //       );
  //   }
  obtenerPlanillas() {
    this.cargandoPlanillas = true;
    this._planillaTallerService
      .obtenerPlanillaTalleresPorCiclo(moment().year(), false)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.cargandoPlanillas = false;
          this.planillasTaller = [...datos];
        },
        (error) => {
          this.cargandoPlanillas = false;
          console.log('[ERROR]', error);
        }
      );
  }

  ngOnDestroy(): void {}
  ngOnInit(): void {
    this.obtenerCiclos();
    const fechaHoy = moment();
    let f = fechaHoy;
    if (this.planillaTaller && !fechaHoy.isSameOrBefore(moment.utc(this.planillaTaller.fechaFinalizacion))) {
      f = moment.utc(this.planillaTaller.fechaFinalizacion);
    }
    this.form = this._fb.group({
      fecha: [this.seguimiento ? this.seguimiento.fecha : f, [Validators.required]],
      alumno: [this.alumno, [Validators.required]],
      planillaTaller: [this.planillaTaller, [Validators.required]],
      cicloLectivo: [
        this.cicloLectivo ? this.cicloLectivo : this.seguimiento ? this.seguimiento.cicloLectivo : null,
        [Validators.required],
      ],
      tipoSeguimiento: [
        this.seguimiento ? this.seguimiento.tipoSeguimiento : null,
        [Validators.required, Validators.minLength(7), Validators.maxLength(300)],
      ],
      resuelto: [this.seguimiento ? this.seguimiento.resuelto : false, [Validators.required]],
      observacion: [
        this.seguimiento ? this.seguimiento.observacion : null,
        [Validators.required, Validators.minLength(7), Validators.maxLength(300)],
      ],
      observacion2: [this.seguimiento ? this.seguimiento.observacion2 : null, [Validators.minLength(7), Validators.maxLength(300)]],
      observacionJefe: [this.seguimiento ? this.seguimiento.observacionJefe : null, [Validators.minLength(7), Validators.maxLength(300)]],
      fechaCreacion: [new Date(moment().format('YYYY-MM-DD')), Validators.required],
      activo: [this.seguimiento ? this.seguimiento.activo : true, [Validators.required]],
    });
    if (!this.planillaTaller) {
      this.form.get('planillaTaller').clearValidators();
      this.form.get('planillaTaller').updateValueAndValidity();
      this.form.get('cicloLectivo').clearValidators();
      this.form.get('cicloLectivo').updateValueAndValidity();
    }
  }
  buscarPlanilla() {}
  obtenerCiclos() {
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
  }
  cerrar(): void {
    this.dialogRef.close();
  }
  buscarCicloLectivo() {
    const { fecha } = this.form.value;
    const anio: string = moment.utc(fecha).format('YYYY');
    const index = this.ciclosLectivos.findIndex((x) => x.anio === Number(anio));
    if (index !== -1) {
      this.form.controls.cicloLectivo.setValue(this.ciclosLectivos[index]);
      return true;
    }
    return false;
  }
  guardar() {
    const hayCiclo = this.buscarCicloLectivo();
    if (!hayCiclo) {
      Swal.fire({
        title: 'Error en el Formulario',
        text: 'El ciclo se genera a traves de la fecha. Seleccione una fecha válida.',
        icon: 'error',
      });
      return;
    }
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
      creadoPor: this.usuario,
      leido: this.usuario.rol === RolConst.ADMIN || this.usuario.rol === RolConst.JEFETALLER ? false : true,
    };
    this._seguimientoAlumnoService
      .agregarSeguimientoAlumno(seguimiento)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          if (datos.success) {
            Swal.fire({
              title: 'Seguimiento del alumno/a agregado',
              text: 'Los datos fueron guardados correctamente',
              icon: 'success',
            });
            this.dialogRef.close(true);
          } else {
            Swal.fire({
              title: 'Seguimiento no guardado',
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
            text: 'No se pudo guardar el seguimiento. Intentelo nuevamente y si el problema persiste comuniquese con el soporte tecnico',
            icon: 'error',
          });
        }
      );
  }

  actualizar() {
    if (!this.buscarCicloLectivo()) {
      Swal.fire({
        title: 'Error en el Formulario',
        text: 'El ciclo se genera a traves de la fecha. Seleccione una fecha válida.',
        icon: 'error',
      });
      return;
    }
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
      fechaModificacion: new Date(),
      modificadoPor: this.usuario,
      leido: this.usuario.rol === RolConst.ADMIN || this.usuario.rol === RolConst.JEFETALLER ? false : true,
    };
    this._seguimientoAlumnoService
      .actualizarSeguimientoAlumno(this.seguimiento._id, seguimientoForm)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          Swal.fire({
            title: 'Seguimiento actualizado',
            text: 'Los datos fueron actualizados correctamente',
            icon: 'success',
          });
          this.cargando = false;
          this._seguimientoAlumnoService.poolingSeguimientos(this.usuario.email);
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
  setPlanilla(evento: IPlanillaTaller) {
    this.planillaTaller = evento;
    this.form.controls.planillaTaller.setValue(evento);
    this.seguimiento.planillaTaller = evento;
    // this.seguimiento = this.form.value;
  }
  showOptions(evento) {
    this.esLeido = evento;
    this.seguimiento.leido = evento;
  }
}
