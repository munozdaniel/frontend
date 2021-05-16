import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AlumnoService } from 'app/core/services/alumno.service';
import { AsistenciaService } from 'app/core/services/asistencia.service';
import { ReportesService } from 'app/core/services/pdf/reportes.services';
import { IAlumno } from 'app/models/interface/iAlumno';
import * as moment from 'moment';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
@UntilDestroy()
@Component({
  selector: 'app-inasistencias-alumnos',
  template: `
    <button-volver></button-volver>
    <div fxLayout="column" class="w-100-p p-24 mt-50" fxLayoutGap="20px">
      <div fxLayout="column" class="mat-card mat-elevation-z4 p-24">
        <div fxLayout fxLayoutAlign="start center" class="w-100-p mb-12" style="border-bottom: 2px solid #80808057">
          <h1 [@animate]="{ value: '*', params: { x: '50px' } }" class="px-12">{{ titulo }}</h1>
          <mat-spinner *ngIf="cargando" matSuffix class="ml-10" diameter="20"></mat-spinner>
        </div>
        <form *ngIf="form" [formGroup]="form" fxLayout="row" fxLayoutAlign="center start" (ngSubmit)="buscarInasistencias()">
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
        <button [disabled]="!alumnos || alumnos.length < 1" mat-raised-button color="accent" (click)="enviarEmail()">
          Enviar Email Masivo
        </button>
      </div>
      <div fxLayout="column" class="text-center text-red mat-card mat-elevation-z4 p-24">
        <h3
          style="color: red;
    font-weight: bolder;"
        >
          Los siguientes alumnos no tienen un email registrado para ser notificados
        </h3>
      </div>
      <app-alumnos-tabla-email [cargando]="cargando" [alumnos]="alumnosNoRegistrados" class="w-100-p"></app-alumnos-tabla-email>
    </div>
  `,
  styles: [],
  animations: [designAnimations],
})
export class InasistenciasAlumnosComponent implements OnInit {
  ejemplo = {
    alumnos: [
      {
        _id: '60639bf8aa435f351465657f',
        activo: true,
        id_planilla_de_asistencia: 64464,
        planillaTaller: {
          _id: '606399661b8f941690757b81',
          activo: true,
          planillaTallerNro: 461,
          planillaTallerId: 377,
          asignatura: {
            _id: '606399591b8f941690757861',
            activo: true,
            detalle: 'MEP Ajuste',
            tipoAsignatura: 'Taller',
            tipoCiclo: '2DO BASICO',
            tipoFormacion: 'Formacion Tecnica - Especifica',
            curso: 2,
            meses: 0,
            horasCatedraAnuales: 0,
            horasCatedraSemanales: 0,
            fechaCreacion: '2021-03-30T00:00:00.000Z',
            IdAsignarutas: 28,
            asignaturaNro: 999,
            __v: 0,
          },
          profesor: {
            _id: '606399531b8f941690757824',
            activo: true,
            id_profesores: 7,
            nombreCompleto: 'Marcelo Muñoz',
            telefono: '299-4-204005',
            celular: null,
            email: 'maharishimahesha@hotmail.com',
            formacion: 'M.E.P.',
            titulo: 'TÉCNICO MECÁNICO ELECTRICISTA',
            fechaCreacion: '2021-03-30T00:00:00.000Z',
            profesorNro: 154,
            __v: 0,
          },
          curso: {
            _id: '6063994a1b8f9416907556ca',
            comision: 'A',
            curso: 2,
            division: 1,
            __v: 0,
            activo: true,
            fechaCreacion: '2021-03-30T00:00:00.000Z',
          },
          cicloLectivo: '6042876e52d71f55d8a8a952',
          observacion: '',
          fechaInicio: '2021-03-15T00:00:00.000Z',
          fechaFinalizacion: '2021-05-14T00:00:00.000Z',
          bimestre: '1er Bimestre',
          fechaCreacion: '2021-03-30T00:00:00.000Z',
          __v: 0,
        },
        alumno: {
          _id: '6063994d1b8f941690756ea5',
          estadoCursadas: ['6063994c1b8f941690756327', '6063994c1b8f941690756328'],
          tipoDni: null,
          sexo: 'MASCULINO',
          activo: true,
          incompleto: false,
          alumnoId: 204819,
          legajo: '204819',
          adultos: [
            {
              activo: true,
              _id: '6063994d1b8f941690756ea6',
              tipoAdulto: 'PADRE',
              fechaCreacion: '2021-03-30T00:00:00.000Z',
              nombreCompleto: 'Paulo Sergio Castillo',
              telefono: '2994688599',
              email: 'paulcast683@gmail.com',
            },
            {
              activo: true,
              _id: '6063994d1b8f941690756ea7',
              tipoAdulto: 'MADRE',
              fechaCreacion: '2021-03-30T00:00:00.000Z',
              nombreCompleto: 'Anal¡a Fabiana Mori',
              telefono: '2994150863',
              email: 'analiafmori@gmail.com',
            },
            {
              activo: true,
              _id: '6063994d1b8f941690756ea8',
              tipoAdulto: 'TUTOR',
              fechaCreacion: '2021-03-30T00:00:00.000Z',
              nombreCompleto: 'El tutor 1  es el PADRE',
              telefono: '2994688599',
              email: 'paulcast683@gmail.com',
            },
            {
              activo: true,
              _id: '6063994d1b8f941690756ea9',
              tipoAdulto: 'TUTOR',
              fechaCreacion: '2021-03-30T00:00:00.000Z',
              nombreCompleto: 'El tutor 2 es la MADRE',
              telefono: '2994150863',
              email: 'analiafmori@gmail.com',
            },
          ],
          dni: '48013152',
          nombreCompleto: 'CASTILLO LAUTARO VALENTIN',
          fechaNacimiento: 'Tue May 22 2007 00:00:00 GMT-0300 (GMT-03:00)',
          observaciones: '',
          observacionTelefono: '',
          nacionalidad: 'ARGENTINA',
          telefono: null,
          celular: null,
          email: 'lautarocastillo1990@gmail.com',
          fechaIngreso: 'Tue Mar 03 2020 00:00:00 GMT-0300 (GMT-03:00)',
          procedenciaColegioPrimario: 'Escuela Cristiana Descubrir',
          procedenciaColegioSecundario: 'Sin Registrar',
          fechaDeBaja: null,
          motivoDeBaja: '0',
          domicilio: 'Naciones Unidas 2184',
          cantidadIntegranteGrupoFamiliar: 0,
          seguimientoEtap: 'NO',
          nombreCompletoTae: '',
          emailTae: '',
          archivoDiagnostico: '',
          fechaCreacion: '2021-03-30T00:00:00.000Z',
          alumnoNro: 25352,
          __v: 0,
        },
        fecha: '2021-03-15T00:00:00.000Z',
        presente: false,
        llegoTarde: false,
        fechaCreacion: '2021-03-30T00:00:00.000Z',
        __v: 0,
        email: 'paulcast683@gmail.com',
        nombreAdulto: 'Paulo Sergio Castillo',
      },
    ],
    alumnosNoRegistrados: [
      {
        _id: '6063994d1b8f941690756897',
        estadoCursadas: ['6063994b1b8f941690755f45', '6063994b1b8f941690755f46', '6063994b1b8f941690755f47', '6063994b1b8f941690755f48'],
        tipoDni: null,
        sexo: 'FEMENINO',
        activo: true,
        incompleto: false,
        alumnoId: 1583,
        legajo: '1583',
        adultos: [
          {
            activo: true,
            _id: '6063994d1b8f941690756898',
            tipoAdulto: 'PADRE',
            fechaCreacion: '2021-03-30T00:00:00.000Z',
            nombreCompleto: '',
            telefono: '',
            email: '',
          },
          {
            activo: true,
            _id: '6063994d1b8f941690756899',
            tipoAdulto: 'MADRE',
            fechaCreacion: '2021-03-30T00:00:00.000Z',
            nombreCompleto: 'MARTINEZ NORA',
            telefono: '2995020148',
            email: '',
          },
          {
            activo: true,
            _id: '6063994d1b8f94169075689a',
            tipoAdulto: 'TUTOR',
            fechaCreacion: '2021-03-30T00:00:00.000Z',
            nombreCompleto: '',
            telefono: '',
            email: '',
          },
          {
            activo: true,
            _id: '6063994d1b8f94169075689b',
            tipoAdulto: 'TUTOR',
            fechaCreacion: '2021-03-30T00:00:00.000Z',
            nombreCompleto: '',
            telefono: '',
            email: '',
          },
        ],
        dni: 'Sin Registrar',
        nombreCompleto: 'SOTO Nahiara Ailen',
        fechaNacimiento: 'Tue Apr 29 2003 00:00:00 GMT-0300 (GMT-03:00)',
        observaciones: '',
        observacionTelefono: '',
        nacionalidad: 'ARGENTINA',
        telefono: null,
        celular: null,
        email: 'Sin Registrar',
        fechaIngreso: 'Sin Registrar',
        procedenciaColegioPrimario: 'Sin Registrar',
        procedenciaColegioSecundario: 'Sin Registrar',
        fechaDeBaja: null,
        motivoDeBaja: null,
        domicilio: 'ALBERTI 25',
        cantidadIntegranteGrupoFamiliar: 0,
        seguimientoEtap: '',
        nombreCompletoTae: '',
        emailTae: '',
        archivoDiagnostico: '',
        fechaCreacion: '2021-03-30T00:00:00.000Z',
        alumnoNro: 25042,
        __v: 0,
      },
    ],
  };
  titulo = 'Ver Inasistencias';
  cargando = false;
  alumnos: any[];
  alumnosNoRegistrados: any[] = [];
  alumnosMerge:any[];
  form: FormGroup;
  rangoHabilitado = false;
  constructor(
    private _fb: FormBuilder,
    private _asistenciaService: AsistenciaService,
    private _alumnoService: AlumnoService,
    private _reportesService: ReportesService
  ) {}

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
  buscarInasistencias() {
    this.alumnosNoRegistrados = [];
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
      .buscarInasistencias(this.form.controls.fechaDesde.value, this.form.controls.fechaHasta.value)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos: any) => {
          this.alumnos = [...datos.alumnos];
          this.alumnosNoRegistrados = [...datos.alumnosNoRegistrados];
          this.cargando = false;
        },
        (error) => {
          this.cargando = false;
          console.log('[ERROR]', error);
        }
      );
  }
  enviarEmail() {
    const alumnosRegistrados: IAlumno[] = this.alumnos.filter((x) => {
      const emailEncontrado = x.adultos.find((a) => a.email);
      if (emailEncontrado) {
        return x;
      }
    });
    Swal.fire({
      title: '¿Está seguro de continuar?',
      html: 'Está a punto de enviar un email informando la inasistencia de los alumnos. Como criterio se utilizará al primer tutor/padre/madre que tenga un email registrado.',
      icon: 'warning',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this._alumnoService.enviarEmailMasivo(alumnosRegistrados, this.form.controls.fecha.value).pipe(
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
            text: 'El asignatura ha sido actualizado correctamente.',
            icon: 'success',
          });
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
  generarReporte() {
    // const alumnos = [...this.alumnos, ...this.alumnosNoRegistrados];
    const alumnos = [...this.ejemplo.alumnos, ...this.ejemplo.alumnosNoRegistrados];
    const { fechaDesde, fechaHasta } = this.form.value;
    this._reportesService.setInformeDeInasistencias(this.alumnosMerge, fechaDesde, fechaHasta);
  }
}
