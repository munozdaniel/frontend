import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AlumnoService } from 'app/core/services/alumno.service';
import { AsistenciaService } from 'app/core/services/asistencia.service';
import { CalificacionService } from 'app/core/services/calificacion.service';
import { PlanillaTallerService } from 'app/core/services/planillaTaller.service';
import { SeguimientoAlumnoService } from 'app/core/services/seguimientoAlumno.service';
import { TemaService } from 'app/core/services/tema.service';
import { IAlumno } from 'app/models/interface/iAlumno';
import { IAsistencia } from 'app/models/interface/iAsistencia';
import { ICalificacion } from 'app/models/interface/iCalificacion';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import { ISeguimientoAlumno } from 'app/models/interface/iSeguimientoAlumno';
import { ITema } from 'app/models/interface/iTema';
import { EmailAusenteModalComponent } from 'app/shared/components/email-ausente-modal/email-ausente-modal.component';
@UntilDestroy()
@Component({
  selector: 'app-planilla-ver',
  template: `
    <button-volver></button-volver>
    <div fxLayout="column" class="w-100-p p-24 mt-50" fxLayoutGap="20px">
      <div fxLayout="column" class="mat-card mat-elevation-z4 p-24" style="border: 2px solid #2196f34a;">
        <div fxLayout fxLayoutAlign="space-between center" class="w-100-p mb-12" style="border-bottom: 2px solid #80808057;">
          <div>
            <h1 [@animate]="{ value: '*', params: { x: '50px' } }" class="px-12">{{ titulo }}</h1>
            <mat-spinner *ngIf="cargando" matSuffix class="ml-10" diameter="20"></mat-spinner>
          </div>
          <h3>Solo Lectura</h3>
        </div>
        <mat-tab-group (selectedTabChange)="controlTabs($event)">
          <mat-tab label="General">
            <app-planilla-detalle-general [planillaTaller]="planillaTaller"></app-planilla-detalle-general>
          </mat-tab>
          <mat-tab label="Asistencias">
            <app-planilla-detalle-asistencias
              [cargandoAsistencias]="cargandoAsistencias"
              [totalClases]="totalClases"
              [cargandoAlumnos]="cargandoAlumnos"
              [alumnos]="alumnos"
              [asistencias]="asistencias"
              (retBuscarAsistenciaPorAlumno)="setBuscarAsistenciaPorAlumno($event)"
              (retEnviarEmail)="setEnviarEmail($event)"
            ></app-planilla-detalle-asistencias
          ></mat-tab>
          <mat-tab label="Calificaciones">
            <app-planilla-detalle-calificaciones
              [cargandoCalificaciones]="cargandoCalificaciones"
              [cargandoAlumnos]="cargandoAlumnos"
              [alumnos]="alumnos"
              [calificaciones]="calificaciones"
              (retBuscarCalificacionesPorAlumno)="setBuscarCalificacionesPorAlumno($event)"
            ></app-planilla-detalle-calificaciones>
          </mat-tab>
          <mat-tab label="Libro de Temas">
            <app-planilla-detalle-temas [temas]="temas" [cargandoTemas]="cargandoTemas"></app-planilla-detalle-temas>
          </mat-tab>
          <mat-tab label="Seguimiento de Alumnos">
            <app-planilla-detalle-seguimiento
              [seguimientos]="seguimientos"
              [cicloLectivo]="planillaTaller?.cicloLectivo"
              [cargandoAlumnos]="cargandoAlumnos"
              [alumnos]="alumnos"
              [cargandoSeguimiento]="cargandoSeguimiento"
              (retBuscarSeguimientosPorAlumno)="setBuscarSeguimientosPorAlumno($event)"
            ></app-planilla-detalle-seguimiento>
          </mat-tab>
          <mat-tab label="Informes">
            <app-informes [planillaTaller]="planillaTaller"> </app-informes>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [],
  animations: [designAnimations],
})
export class PlanillaVerComponent implements OnInit {
  indiceTab = 0;
  titulo = 'Planilla';
  cargando = false;
  cargandoAlumnos = false;
  planillaId: string;
  ciclo: number;
  planillaTaller: IPlanillaTaller;
  alumnos: IAlumno[];
  //   Asistencias
  asistencias: IAsistencia[];
  cargandoAsistencias: boolean;
  totalClases;
  //   Calificaciones
  cargandoCalificaciones: boolean;
  calificaciones: ICalificacion[];
  // Alumno
  alumnoSeleccionado: IAlumno;
  // Temas
  cargandoTemas: boolean;
  temas: ITema[];
  //   Seguimiento
  seguimientos: ISeguimientoAlumno[];
  cargandoSeguimiento: boolean;
  constructor(
    private _dialog: MatDialog,
    private _activeRoute: ActivatedRoute,
    private _alumnoService: AlumnoService,
    private _temaService: TemaService,
    private _asistenciaService: AsistenciaService,
    private _calificacionService: CalificacionService,
    private _planillaTallerService: PlanillaTallerService,
    private _seguimientoAlumnoService: SeguimientoAlumnoService
  ) {}

  ngOnInit(): void {
    this._activeRoute.params.subscribe((params) => {
      this.planillaId = params['id'];
      this.ciclo = params['ciclo'];
      this.cargando = true;
      this._planillaTallerService
        .obtenerPlanillaTallerPorIdCiclo(this.planillaId, this.ciclo)
        .pipe(untilDestroyed(this))
        .subscribe(
          (datos) => {
            this.planillaTaller = datos;
            this.obtenerAlumnosPorCurso();
            this.cargando = false;
          },
          (error) => {
            this.cargando = false;
            console.log('[ERROR]', error);
          }
        );
    });
  }
  obtenerAlumnosPorCurso() {
    this.cargandoAlumnos = true;
    const { curso, comision, division } = this.planillaTaller.curso;
    this._alumnoService
      .obtenerAlumnosPorCursoCiclo(curso, division, comision, this.ciclo)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          console.log('datos', datos);
          this.alumnos = datos;
          this.cargandoAlumnos = false;
        },
        (error) => {
          this.cargandoAlumnos = false;
          console.log('[ERROR]', error);
        }
      );
  }
  controlTabs(evento) {
    console.log('controlTabs', evento);
    this.indiceTab = evento.index;
    switch (evento.index) {
      case 0:
        console.log('GENERAL');
        this.titulo = 'Planilla de Taller';
        break;
      case 1:
        console.log('ASISTENCIAS');
        this.titulo = 'Asistencias del Alumno';
        // Si hay asistencias entonces hay alumnoSeleccionado. Controlamos para no repetir la consulta
        if (
          (!this.asistencias && this.alumnoSeleccionado) ||
          (this.asistencias && this.asistencias.length > 0 && this.alumnoSeleccionado._id !== this.asistencias[0].alumno._id)
        ) {
          this.setBuscarAsistenciaPorAlumno(this.alumnoSeleccionado);
        }
        if (!this.totalClases) {
          this.buscarTotalesPorPlanilla();
        }
        break;
      case 2:
        this.titulo = 'Calificaciones del Alumno';
        console.log('CALIFICACIONES');
        if (
          (!this.calificaciones && this.alumnoSeleccionado) ||
          (this.calificaciones && this.calificaciones.length > 0 && this.alumnoSeleccionado._id !== this.calificaciones[0].alumno._id)
        ) {
          this.setBuscarCalificacionesPorAlumno(this.alumnoSeleccionado);
        }
        break;
      case 3:
        this.titulo = 'Libro de Temas del Profesor';
        console.log('LIBRO DE TEMAS');
        if (!this.temas) {
          this.obtenerLibroDeTemas();
        }
        break;
      case 4:
        this.titulo = 'Seguimiento del Alumno';
        console.log('SEGUIMIENTO DE ALUMNOS');
        if (
          (!this.seguimientos && this.alumnoSeleccionado) ||
          (this.seguimientos && this.seguimientos.length > 0 && this.alumnoSeleccionado._id !== this.seguimientos[0].alumno._id)
        ) {
          this.setBuscarSeguimientosPorAlumno(this.alumnoSeleccionado);
        }
        break;
      case 5:
        this.titulo = 'Informes';
        console.log('INFORMES');
        break;

      default:
        break;
    }
  }
  buscarTotalesPorPlanilla() {
    console.log('this.planillaId', this.planillaId);
    this._planillaTallerService
      .buscarTotalAsistenciaPorPlanilla(this.planillaId)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          console.log('datos', datos);
          this.totalClases = datos.total;
        },
        (error) => {
          console.log('[ERROR]', error);
          this.cargandoAsistencias = false;
        }
      );
  }
  //   Output Asistencias

  setBuscarAsistenciaPorAlumno(alumno: IAlumno) {
    console.log('1');
    this.cargandoAsistencias = true;
    this._asistenciaService
      .obtenerAsistenciasPorAlumnoId(alumno._id, this.planillaId)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.asistencias = [...datos];
          this.cargandoAsistencias = false;
        },
        (error) => {
          console.log('[ERROR]', error);
          this.cargandoAsistencias = false;
        }
      );
  }
  setEnviarEmail({ asistencia, faltas }) {
    const dialogRef = this._dialog.open(EmailAusenteModalComponent, {
      width: '50%',
      data: { asistencia, alumno: this.alumnoSeleccionado, faltas },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
  //   Output Calificaciones
  setBuscarCalificacionesPorAlumno(alumno: IAlumno) {
    console.log('2');
    this.cargandoCalificaciones = true;
    this._calificacionService
      .obtenerCalificacionesPorAlumnoId(alumno._id, this.planillaId)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.calificaciones = [...datos];
          this.cargandoCalificaciones = false;
        },
        (error) => {
          console.log('[ERROR]', error);
          this.cargandoCalificaciones = false;
        }
      );
  }
  //   Temas
  obtenerLibroDeTemas() {
    this.cargandoTemas = true;
    this._temaService
      .obtenerTemaPorPlanillaTaller(this.planillaId)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.temas = datos;
          console.log('temas', this.temas);
          this.cargandoTemas = false;
        },
        (error) => {
          this.cargandoTemas = false;
          console.log('[ERROR]', error);
        }
      );
  }
  //   Seguimientos
  setBuscarSeguimientosPorAlumno(alumno: IAlumno) {
    this.cargandoSeguimiento = true;
    this._seguimientoAlumnoService
      .obtenerPorPlanillaYAlumno(this.planillaId, alumno._id)
      //   .obtenerSeguimientoAlumnoPorPlanillaCiclo(this.planillaId, alumno._id, this.ciclo)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.seguimientos = datos;
          console.log('obtenerSeguimientoAlumnoPorPlanillaCiclo', this.temas);
          this.cargandoSeguimiento = false;
        },
        (error) => {
          this.cargandoSeguimiento = false;
          console.log('[ERROR]', error);
        }
      );
  }
}
