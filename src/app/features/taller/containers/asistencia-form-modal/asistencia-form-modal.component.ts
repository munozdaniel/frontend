import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AsistenciaService } from 'app/core/services/asistencia.service';
import { IAlumno } from 'app/models/interface/iAlumno';
import { IAsistencia } from 'app/models/interface/iAsistencia';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import { CONFIG_PROVIDER } from 'app/shared/config.provider';
import * as moment from 'moment';
import Swal from 'sweetalert2';
@UntilDestroy()
@Component({
  selector: 'app-asistencia-form-modal',
  templateUrl: './asistencia-form-modal.component.html',
  styleUrls: ['./asistencia-form-modal.component.scss'],
  animations: [designAnimations],
  providers: CONFIG_PROVIDER,
})
export class AsistenciaFormModalComponent implements OnInit, OnDestroy {
  cargando = false;
  form: FormGroup;
  planillaTaller: IPlanillaTaller;
  alumno: IAlumno;
  asistencia: IAsistencia;
  today = new Date();
  minimo;
  maximo;
  isUpdate: boolean;

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<AsistenciaFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _asistenciaService: AsistenciaService
  ) {
    this.planillaTaller = data.planillaTaller;
    this.minimo = new Date(moment.utc(this.planillaTaller.fechaInicio).toDate());
    this.maximo = new Date(moment.utc(this.planillaTaller.fechaFinalizacion).add(1, 'day').toDate());
    this.alumno = data.alumno;
    if (data.asistencia) {
      this.isUpdate = true;
      this.asistencia = data.asistencia;
    }
  }
  ngOnDestroy(): void {}

  ngOnInit(): void {
    const fechaHoy = moment();
    let f = fechaHoy;
    if (!fechaHoy.isSameOrBefore(moment.utc(this.planillaTaller.fechaFinalizacion))) {
      f = moment.utc(this.planillaTaller.fechaFinalizacion);
    }
    this.form = this._fb.group({
      fecha: [this.asistencia ? this.asistencia.fecha : f, [Validators.required]],
      presente: [this.asistencia ? this.asistencia.presente : true, []],
      llegoTarde: [this.asistencia ? this.asistencia.llegoTarde : false, []],
      ausentePermitido: [this.asistencia ? this.asistencia.ausentePermitido : false, []],
      alumno: [this.alumno.nombreCompleto, [Validators.required]],
      planillaTaller: [this.planillaTaller, [Validators.required]],
    });
  }
  cerrar(): void {
    this.dialogRef.close();
  }
  guardar() {
    if (!this.form.valid) {
      Swal.fire({
        title: 'Error en el Formulario',
        text: 'Verifique de haber ingresado todos los datos requeridos en el formulario de asistencia.',
        icon: 'error',
      });
      return;
    }
    this.cargando = true;

    const fecha = new Date(moment.utc(this.form.controls.fecha.value).format('YYYY-MM-DD'));
    const asistencia: IAsistencia = { ...this.form.value, fecha, alumno: this.alumno, activo: true, fechaCreacion: new Date() };
    this._asistenciaService
      .guardarAsistencia(asistencia)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          Swal.fire({
            title: 'Asistencia agregada',
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
            text: 'No se pudo guardar la asistencia. Intentelo nuevamente y si el problema persiste comuniquese con el soporte tecnico',
            icon: 'error',
          });
        }
      );
  }
  actualizar() {
    if (!this.form.valid) {
      Swal.fire({
        title: 'Error en el Formulario',
        text: 'Verifique de haber ingresado todos los datos requeridos en el formulario de asistencia.',
        icon: 'error',
      });
      return;
    }
    this.cargando = true;

    const fecha = new Date(moment.utc(this.form.controls.fecha.value).format('YYYY-MM-DD'));
    const asistenciaForm: IAsistencia = { ...this.form.value, fecha, alumno: this.alumno, activo: true, fechaCreacion: new Date() };
    this._asistenciaService
      .actualizarAsistencia(this.asistencia._id, asistenciaForm)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          Swal.fire({
            title: 'Asistencia actualizada',
            text: 'Los datos fueron guardados correctamente',
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
            text: 'No se pudo guardar la asistencia. Intentelo nuevamente y si el problema persiste comuniquese con el soporte tecnico',
            icon: 'error',
          });
        }
      );
  }
  controlarAsistencia(evento) {
    if (evento.checked === false) {
      this.form.controls.llegoTarde.setValue(false);
    }
  }
}
