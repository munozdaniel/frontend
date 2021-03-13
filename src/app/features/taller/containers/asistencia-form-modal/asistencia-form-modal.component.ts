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
    console.log('cinstr', data.planillaTaller);
    this.planillaTaller = data.planillaTaller;
    this.minimo = new Date(this.planillaTaller.fechaInicio);
    this.maximo = new Date(this.planillaTaller.fechaFinalizacion);
    this.alumno = data.alumno;
    if (data.asistencia) {
      this.isUpdate = true;
      this.asistencia = data.asistencia;
    }
  }
  ngOnDestroy(): void {}

  ngOnInit(): void {
    console.log('asistencia', this.asistencia);
    const fechaHoy = moment();
    let f = fechaHoy;
    if (!fechaHoy.isSameOrBefore(moment(this.planillaTaller.fechaFinalizacion))) {
      f = moment(this.planillaTaller.fechaFinalizacion);
    }
    this.form = this._fb.group({
      fecha: [this.asistencia ? this.asistencia.fecha : f, [Validators.required]],
      presente: [this.asistencia ? this.asistencia.presente : true, []],
      llegoTarde: [this.asistencia ? this.asistencia.llegoTarde : false, []],
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

    const fecha = new Date(moment(this.form.controls.fecha.value).format('YYYY-MM-DD'));
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
          this.dialogRef.close(true);
        },
        (error) => {
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

    const fecha = new Date(moment(this.form.controls.fecha.value).format('YYYY-MM-DD'));
    const asistenciaForm: IAsistencia = { ...this.form.value, fecha, alumno: this.alumno, activo: true, fechaCreacion: new Date() };
    console.log('asistencia', asistenciaForm);
    this._asistenciaService
      .actualizarAsistencia(this.asistencia._id, asistenciaForm)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          Swal.fire({   
            title: 'Asistencia agregada',
            text: 'Los datos fueron guardados correctamente',
            icon: 'success',
          });
          this.dialogRef.close(true);
        },
        (error) => {
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
    console.log(evento);
    if (evento.checked === false) {
      this.form.controls.llegoTarde.setValue(false);
    }
  }
}
