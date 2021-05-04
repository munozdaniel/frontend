import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { designAnimations } from '@design/animations';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inasistencia-semanal',
  template: `
    <div fxLayout="column" class="w-100-p p-24" fxLayoutGap="20px">
      <div fxLayout="column" class="mat-card mat-elevation-z4 p-24">
        <div fxLayout fxLayoutAlign="start center" class="w-100-p mb-12" style="border-bottom: 2px solid #80808057;">
          <h1 [@animate]="{ value: '*', params: { x: '50px' } }" class="px-12">{{ titulo }}</h1>
          <mat-spinner *ngIf="cargando" matSuffix class="ml-10" diameter="20"></mat-spinner>
        </div>
        <div fxLayout="row wrap" fxLayoutAlign="space-between baseline" style="gap:20px">
          <form
            [formGroup]="form"
            fxLayout="row wrap"
            fxLayoutAlign="start baseline"
            fxLayoutGap="10px"
            class="w-100-p"
            (ngSubmit)="buscarInforme()"
          >
            <!-- tipoSeguimiento ============================= -->
            <mat-form-field appearance="outline">
              <mat-label>Fecha Desde</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="fechaDesde" />
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-error *ngIf="form.controls.fechaDesde.hasError('required')"> Este campo es requerido. </mat-error>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Fecha Hasta</mat-label>
              <input matInput [matDatepicker]="pickerHasta" formControlName="fechaHasta" />
              <mat-datepicker-toggle matSuffix [for]="pickerHasta"></mat-datepicker-toggle>
              <mat-datepicker #pickerHasta></mat-datepicker>
              <mat-error *ngIf="form.controls.fechaHasta.hasError('required')"> Este campo es requerido. </mat-error>
            </mat-form-field>
            <div fxLayout="row" fxLayoutAlign="center start" fxFlex.gt-xs="20" fxFlex.xs="100">
              <button mat-raised-button color="accent" class="w-100-p"><mat-icon>search</mat-icon> Buscar</button>
            </div>
          </form>
        </div>
      </div>
      <!--  -->
    </div>
  `,
  styles: [],
  animations: [designAnimations],
})
export class InasistenciaSemanalComponent implements OnInit {
  titulo = 'Inasistencias Semanal';
  cargando = false;
  form: FormGroup;
  constructor(private _fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this._fb.group({
      fechaDesde: [moment().add(-7, 'days'), [Validators.required]],
      fechaHasta: [moment(), [Validators.required]],
    });
  }
  buscarInforme() {
    if (this.form.invalid) {
      Swal.fire({
        title: 'Fecha incorrecta',
        text: 'Verifique que la fecha que haya seleccionado corresponda a un dato válido',
        icon: 'error',
      });
    } else {
    }
  }
}
