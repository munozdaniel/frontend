import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AlumnoService } from 'app/core/services/alumno.service';
import { AsistenciaService } from 'app/core/services/asistencia.service';
import { CalificacionService } from 'app/core/services/calificacion.service';
import { PlanillaTallerService } from 'app/core/services/planillaTaller.service';
import { IAlumno } from 'app/models/interface/iAlumno';
import { IAsistencia } from 'app/models/interface/iAsistencia';
import { ICalificacion } from 'app/models/interface/iCalificacion';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
@UntilDestroy()
@Component({
  selector: 'app-planilla-ver',
  template: `
    <button-volver></button-volver>
    <div fxLayout="column" class="w-100-p p-24 mt-50" fxLayoutGap="20px">
      <div fxLayout="column" class="mat-card mat-elevation-z4 p-24">
        <div fxLayout fxLayoutAlign="start center" class="w-100-p mb-12" style="border-bottom: 2px solid #80808057;">
          <h1 [@animate]="{ value: '*', params: { x: '50px' } }" class="px-12">{{ titulo }}</h1>
          <mat-spinner *ngIf="cargando" matSuffix class="ml-10" diameter="20"></mat-spinner>
        </div>
        <mat-tab-group (selectedTabChange)="controlTabs($event)">
          <mat-tab label="General">
            <app-planilla-detalle-general [planillaTaller]="planillaTaller"></app-planilla-detalle-general>
          </mat-tab>
          <mat-tab label="Asistencias">
            <app-planilla-detalle-asistencias
              [cargandoAsistencias]="cargandoAsistencias"
              [cargandoAlumnos]="cargandoAlumnos"
              [alumnos]="alumnos"
              [asistencias]="asistencias"
              (retBuscarAsistenciaPorAlumno)="setBuscarAsistenciaPorAlumno($event)"
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
          <mat-tab label="Libro de Temas"> Content 3 </mat-tab>
          <mat-tab label="Seguimiento de Alumnos"> Content 3 </mat-tab>
          <mat-tab label="Informes"> Content 3 </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [],
  animations: [designAnimations],
})
export class PlanillaVerComponent implements OnInit {
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
  //   Calificaciones
  cargandoCalificaciones: boolean;
  calificaciones: ICalificacion[];
  // Alumno
  alumnoSeleccionado: IAlumno;
  constructor(
    private _activeRoute: ActivatedRoute,
    private _alumnoService: AlumnoService,
    private _asistenciaService: AsistenciaService,
    private _calificacionService: CalificacionService,
    private _planillaTallerService: PlanillaTallerService
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
            console.log('datos', datos);
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
        break;
      case 4:
        this.titulo = 'Seguimiento del Alumno';
        console.log('SEGUIMIENTO DE ALUMNOS');
        break;
      case 5:
        this.titulo = 'Informes';
        console.log('INFORMES');
        break;

      default:
        break;
    }
  }
  setBuscarAsistenciaPorAlumno(alumno: IAlumno) {
    console.log('1');
    this.alumnoSeleccionado = alumno;
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
  setBuscarCalificacionesPorAlumno(alumno: IAlumno) {
    console.log('2');
    this.alumnoSeleccionado = alumno;
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
}