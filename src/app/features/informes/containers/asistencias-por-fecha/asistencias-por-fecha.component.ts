import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AsistenciaService } from 'app/core/services/asistencia.service';
import { ReportesService } from 'app/core/services/pdf/reportes.services';
import { IAlumno } from 'app/models/interface/iAlumno';
import * as moment from 'moment';
import * as _ from 'lodash';
import Swal from 'sweetalert2';
@UntilDestroy()
@Component({
  selector: 'app-asistencias-por-fecha',
  template: `
    <button-volver></button-volver>
    <div fxLayout="column" class="w-100-p p-24 mt-50" fxLayoutGap="20px">
      <div fxLayout="column" class="mat-card mat-elevation-z4 p-24">
        <div fxLayout fxLayoutAlign="start center" class="w-100-p mb-12" style="border-bottom: 2px solid #80808057">
          <h1 [@animate]="{ value: '*', params: { x: '50px' } }" class="px-12">{{ titulo }}</h1>
          <mat-spinner *ngIf="cargando" matSuffix class="ml-10" diameter="20"></mat-spinner>
        </div>
        <form *ngIf="form" [formGroup]="form" fxLayout="row" fxLayoutAlign="center start" (ngSubmit)="buscarAsistencias()">
          <div fxLayout="column">
            <div fxLayout="row wrap" fxLayoutAlign.xs="center start" fxLayoutAlign.gt-xs="start baseline" fxLayoutGap.gt-xs="10px">
              <mat-form-field appearance="outline" fxFlex.xs="100">
                <mat-label>Fecha Desde </mat-label>
                <input matInput [matDatepicker]="picker" formControlName="fechaDesde" />
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
                <mat-error *ngIf="form.controls.fechaDesde.hasError('required')"> Este campo es requerido. </mat-error>
              </mat-form-field>
              <mat-form-field *ngIf="rangoHabilitado" appearance="outline" fxFlex.xs="100">
                <mat-label>Fecha Hasta</mat-label>
                <input matInput [matDatepicker]="pickerHasta" formControlName="fechaHasta" />
                <mat-datepicker-toggle matSuffix [for]="pickerHasta"></mat-datepicker-toggle>
                <mat-datepicker #pickerHasta></mat-datepicker>
                <mat-error *ngIf="form.controls.fechaHasta.hasError('required')"> Este campo es requerido. </mat-error>
              </mat-form-field>
              <mat-error *ngIf="form.errors?.fechas">{{ form.errors.fechas }}</mat-error>
            </div>
            <mat-checkbox class="mb-12" (click)="habilitarRango()">Buscar por rango</mat-checkbox>
            <button *ngIf="!form.errors?.fechas" [disabled]="form.invalid" mat-raised-button color="primary">
              <mat-icon>search</mat-icon> Buscar
            </button>
          </div>
        </form>
      </div>
      <!--  -->
      <app-alumnos-tabla-email [cargando]="cargando" [alumnos]="alumnos"></app-alumnos-tabla-email>
      <div fxLayout="row" fxLayoutAlign="center start" fxLayoutGap="20px">
        <button [disabled]="!alumnos || alumnos.length < 1" mat-raised-button color="warn" (click)="generarReporte()">
          Generar Reporte
        </button>
      </div>
    </div>
  `,
  styles: [],
  animations: [designAnimations],
})
export class AsistenciasPorFechaComponent implements OnInit {
  titulo = 'Buscar asistencias por fechas';
  cargando = false;
  alumnos: any[];
  form: FormGroup;
  rangoHabilitado = false;
  // Mobile

  constructor(private _fb: FormBuilder, private _reportesService: ReportesService, private _asistenciaService: AsistenciaService) {}

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
  buscarAsistencias() {
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
      .buscarAsistenciasPorFechas(this.form.controls.fechaDesde.value, this.rangoHabilitado ? this.form.controls.fechaHasta.value : null)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos: any) => {
          this.alumnos = [...datos.alumnos];
          this.cargando = false;
        },
        (error) => {
          this.cargando = false;
          console.log('[ERROR]', error);
        }
      );
  }
  /**
   * Agrupar entre multiples key [GroupBy, Multiple]
   * @param array
   * @param f
   * @returns
   */
  groupByMultipleCampos(array, f) {
    var groups = {};
    array.forEach(function (o) {
      var group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
      return groups[group];
    });
  }
  generarReporte() {
    // const alumnos = [...this.alumnos, ...this.alumnosNoRegistrados];
    const { fechaDesde, fechaHasta } = this.form.value;

    if (this.rangoHabilitado) {
      const agrupacion = this.groupByMultipleCampos(this.alumnos, (x) => {
        return [x.fecha, x.planillaTaller._id];
      });
      this._reportesService.setInformeDeAsistenciasPorFechas(agrupacion, fechaDesde, fechaHasta);
    } else {
      // Agrupar por un solo  campo
      const agrupar: any = _.chain(this.alumnos)
        // Group the elements of Array based on `color` property
        .groupBy('planillaTaller._id')
        // `key` is group's name (color), `value` is the array of objects
        .map((value, key) => ({ planillaTaller: key, grupoPlanilla: value }))
        .value();
      this._reportesService.setInformeDeAsistenciasPorDia(agrupar, fechaDesde);
    }
  }
}
