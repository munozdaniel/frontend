import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CalendarioService } from 'app/core/services/calendario.service';
import { CicloLectivoService } from 'app/core/services/ciclo-lectivo.service';
import { ICalendario } from 'app/models/interface/iCalendario';
import * as moment from 'moment';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
@UntilDestroy()
@Component({
  selector: 'app-calendario-academico',
  template: `
    <button-volver></button-volver>
    <div fxLayout="column" class="w-100-p p-24 mt-50" fxLayoutGap="20px">
      <div fxLayout="column" class="mat-card mat-elevation-z4 p-24">
        <div fxLayout fxLayoutAlign="start center" class="w-100-p mb-12" style="border-bottom: 2px solid #80808057;">
          <h1 [@animate]="{ value: '*', params: { x: '50px' } }" class="px-12">{{ titulo }}</h1>
          <mat-spinner *ngIf="cargando" matSuffix class="ml-10" diameter="20"></mat-spinner>
        </div>
        <div fxLayout.xs="column" fxLayout.gt-xs="row wrap" fxLayoutAlign="space-between baseline" fxLayoutGap.xs="20px">
          <app-form-ciclo-lectivo
            fxFlex.gt-xs="40"
            fxFlex.xs="100"
            class="w-100-p"
            [cicloLectivo]="cicloActual"
            (retParametrosBusqueda)="setParametrosBusqueda($event)"
          ></app-form-ciclo-lectivo>
          <button mat-raised-button fxFlex.gt-xs="40" fxFlex.xs="100" color="accent" (click)="toggleCalendario()" class="w-100-p">
            <mat-icon *ngIf="!mostrarAgregar">add</mat-icon> <span *ngIf="!mostrarAgregar">Crear Nuevo Calendario</span>
            <mat-icon *ngIf="mostrarAgregar">close</mat-icon> <span *ngIf="mostrarAgregar">Ocultar Formulario</span>
          </button>
        </div>
      </div>
      <!--  -->
      <div *ngIf="mostrarAgregar" [@slideInOutFromTop] class="mat-card mat-elevation-z4 p-12" fxLayout="column">
        <h3>Crear Calendario Academico {{ cicloActual }}</h3>
        <form [formGroup]="form" fxLayout="row wrap" fxLayoutAlign="start baseline" fxLayoutGap="10px">
          <!-- FechaInicio ============================= -->
          <mat-form-field appearance="outline" fxFlex.gt-xs="35" fxFlex.xs="100">
            <mat-label>Fecha de Inicio</mat-label>
            <input autocomplete="off" [min]="min" [max]="max" matInput [matDatepicker]="picker" formControlName="fechaInicio" />
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
            <mat-error *ngIf="form.controls.fechaInicio.hasError('required')"> Este campo es requerido. </mat-error>
          </mat-form-field>
          <!-- FechaFinal ============================= -->
          <mat-form-field appearance="outline" fxFlex.gt-xs="35" fxFlex.xs="100">
            <mat-label>Fecha de Fin</mat-label>
            <input autocomplete="off" [min]="min" [max]="max" matInput [matDatepicker]="pickerFinal" formControlName="fechaFinalizacion" />
            <mat-datepicker-toggle matSuffix [for]="pickerFinal"></mat-datepicker-toggle>
            <mat-datepicker #pickerFinal></mat-datepicker>
            <mat-error *ngIf="form.controls.fechaFinalizacion.hasError('required')"> Este campo es requerido. </mat-error>
          </mat-form-field>

          <button mat-raised-button color="accent" [disabled]="form.invalid" (click)="crearCicloPrueba()">Crear</button>
        </form>
      </div>
      <app-calendario-datos [calendario]="calendario"></app-calendario-datos>
    </div>
  `,
  styles: [],
  animations: [designAnimations],
})
export class CalendarioAcademicoComponent implements OnInit {
  mostrarAgregar = false;
  titulo = 'Calendario Academico';
  cargando: boolean;
  cicloActual: number;
  form: FormGroup;
  calendario: ICalendario[];
  max;
  min;
  constructor(
    private _fb: FormBuilder,
    private _calendarioService: CalendarioService,
    private _cicloLectivoService: CicloLectivoService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.form = this._fb.group({ fechaInicio: [], fechaFinalizacion: [] });
    const thisYear = new Date().getFullYear();
    const start = new Date('1/1/' + thisYear);
    const end = new Date(thisYear + '-12-31');
    this.min = start;
    this.max = end;

    this._cicloLectivoService.cicloLectivo$.pipe(untilDestroyed(this)).subscribe((cicloLectivo) => {
      this.cicloActual = cicloLectivo ? cicloLectivo : moment().year();
      this.recuperarCalendarioPorCiclo(this.cicloActual);
    });
  }
  setParametrosBusqueda({ cicloLectivo }) {
    this._cicloLectivoService.setCicloLectivo(cicloLectivo);
    // this.recuperarPlanillasPorCiclo(cicloLectivo);
  }
  recuperarCalendarioPorCiclo(ciclo: number) {
    this.cargando = true;
    this._calendarioService
      .obtenerCalendarioPorCiclo(ciclo)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          console.log('calendario por ciclo', datos);
          this.cargando = false;
          this.calendario = [...datos];
        },
        (error) => {
          this.cargando = false;
          console.log('[ERROR]', error);
        }
      );
  }
  crearCicloPrueba() {
    const { fechaInicio, fechaFinalizacion: fechaFin } = this.form.value;
    Swal.fire({
      title: '¿Está seguro de continuar?',
      html: 'Está a punto de crear un nuevo calendario academico sobreescribiendo las fechas en caso de que existieran.',
      icon: 'warning',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this._calendarioService.crearCalendario(fechaInicio, fechaFin).pipe(
          catchError((error) => {
            console.log('[ERROR]', error);
            Swal.fire({
              title: 'Oops! Ocurrió un error',
              text: error && error.error ? error.error.message : 'Error de conexion',
              icon: 'error',
            });
            return of(error);
          }),
          untilDestroyed(this)
        );
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result: any) => {
      if (result.isConfirmed) {
        if (result.value && result.value.success) {
          Swal.fire({
            title: 'Operación Exitosa',
            text: 'El seguimiento ha sido actualizado correctamente.',
            icon: 'success',
          });
          this.calendario = [...result.value.calendarioNuevo];
        } else {
          Swal.fire({
            title: 'Oops! Ocurrió un error',
            text: 'Intentelo nuevamente. Si el problema persiste comuniquese con el soporte técnico.',
            icon: 'error',
          });
        }
      }
    });
    // } else {
    //   Swal.fire({
    //     title: 'Fechas incorrectas',
    //     text: 'NO puede crear un calendario academico de años anteriores',
    //     icon: 'error',
    //   });
    // }
  }

  toggleCalendario() {
    this.mostrarAgregar = !this.mostrarAgregar;
  }
}
