import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AlumnoService } from 'app/core/services/alumno.service';
import { AsistenciaService } from 'app/core/services/asistencia.service';
import { CalificacionService } from 'app/core/services/calificacion.service';
import { PlanillaTallerService } from 'app/core/services/planillaTaller.service';
import { SeguimientoAlumnoService } from 'app/core/services/seguimientoAlumno.service';
import { TemaService } from 'app/core/services/tema.service';
import { TemplateEnum } from 'app/models/constants/tipo-template.const';
import { IAlumno } from 'app/models/interface/iAlumno';
import { IAsistencia } from 'app/models/interface/iAsistencia';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
@UntilDestroy()
@Component({
  selector: 'app-planilla-taller-administrar',
  template: `
    <button-volver></button-volver>
    <div fxLayout="column" class="w-100-p p-24 mt-50" fxLayoutGap="20px">
      <div fxLayout="column" class="mat-card mat-elevation-z4 p-24">
        <div fxLayout fxLayoutAlign="start center" class="w-100-p mb-12" style="border-bottom: 2px solid #80808057;">
          <h1 [@animate]="{ value: '*', params: { x: '50px' } }" class="px-12">{{ titulo }}</h1>
          <mat-spinner *ngIf="cargando" matSuffix class="ml-10" diameter="20"></mat-spinner>
        </div>
        <mat-tab-group [selectedIndex]="indiceTab" (selectedTabChange)="controlTabs($event)">
          <mat-tab label="General">
            <!-- Componente Smart podria ser UI pero no D: -->
            <app-planilla-editar [cargando]="cargando" [planillaTaller]="planillaTaller"></app-planilla-editar>
          </mat-tab>
          <mat-tab label="Asistencias">
            <app-planilla-detalle-asistencias
              [template]="template"
              [cargandoAsistencias]="cargandoAsistencias"
              [cargandoAlumnos]="cargandoAlumnos"
              [alumnos]="alumnos"
              [asistencias]="asistencias"
              (retBuscarAsistenciaPorAlumno)="setBuscarAsistenciaPorAlumno($event)"
            ></app-planilla-detalle-asistencias>
            <!-- <app-administrar-asistencias [cargandoAlumnos]="cargandoAlumnos" [alumnos]="alumnos"> </app-administrar-asistencias> -->
          </mat-tab>
          <mat-tab label="Calificaciones"> </mat-tab>
          <mat-tab label="Libro de Temas"> </mat-tab>
          <mat-tab label="Seguimiento de Alumnos"> </mat-tab>
          <mat-tab label="Informes"> <app-planilla-detalle-informes> </app-planilla-detalle-informes> </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [],
  animations: [designAnimations],
})
export class PlanillaTallerAdministrarComponent implements OnInit {
  template = TemplateEnum.EDICION;
  indiceTab = 0;
  titulo = 'Planilla';
  planillaId;
  tipoPantalla;
  // PlanillaTaller
  planillaTaller: IPlanillaTaller;
  cargando = false;
  cargandoAlumnos = false;
  alumnos: IAlumno[];
  alumnoSeleccionado: IAlumno;
  //   Asistencias
  asistencias: IAsistencia[];
  cargandoAsistencias: boolean;
  //   Calificaciones
  //   Seguimiento
  //   Temas
  //   Informes
  constructor(
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
      this.tipoPantalla = params['tipo'];
      this.seleccionarTab();
      this.obtenerPlanilla();
    });
  }
  obtenerPlanilla() {
    this.cargando = true;
    this._planillaTallerService
      .obtenerPlanillaTallerPorId(this.planillaId)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          console.log('obtenerPlanillaTallerPorId', datos);
          this.planillaTaller = { ...datos };
          this.obtenerAlumnosPorCursoDivisionCiclo();
          this.cargando = false;
        },
        (error) => {
          this.cargando = false;
          console.log('[ERROR]', error);
        }
      );
  }
  obtenerAlumnosPorCursoDivisionCiclo() {
    this.cargandoAlumnos = true;
    const { curso, division } = this.planillaTaller.curso;
    this._alumnoService
      .obtenerAlumnosPorCursoDivisionCiclo(curso, division, this.planillaTaller.cicloLectivo.anio)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          console.log('obtenerAlumnosPorCursoCiclo', datos);
          this.alumnos = datos;
          this.cargandoAlumnos = false;
        },
        (error) => {
          this.cargandoAlumnos = false;
          console.log('[ERROR]', error);
        }
      );
  }
  //   obtenerAlumnosPorCurso() {
  //     this.cargandoAlumnos = true;
  //     const { curso, division } = this.planillaTaller.curso;
  //     this._asistenciaService
  //       .obtenerAsistenciasPorAlumnosCurso(curso, division, this.planillaTaller.cicloLectivo.anio)
  //       .pipe(untilDestroyed(this))
  //       .subscribe(
  //         (datos) => {
  //           console.log('obtenerAlumnosPorCursoCiclo', datos);
  //           this.alumnos = datos;
  //           this.cargandoAlumnos = false;
  //         },
  //         (error) => {
  //           this.cargandoAlumnos = false;
  //           console.log('[ERROR]', error);
  //         }
  //       );
  //   }
  seleccionarTab() {
    switch (this.tipoPantalla) {
      case 'asistencias':
        this.indiceTab = 1;
        break;
      case 'calificaciones':
        this.indiceTab = 2;
        break;
      case 'seguimientos':
        this.indiceTab = 3;
        break;
      case 'temas':
        this.indiceTab = 4;
        break;
      case 'informes':
        this.indiceTab = 5;
        break;
      default:
        this.indiceTab = 0;
        break;
    }
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
        // if (
        //   (!this.asistencias && this.alumnoSeleccionado) ||
        //   (this.asistencias && this.asistencias.length > 0 && this.alumnoSeleccionado._id !== this.asistencias[0].alumno._id)
        // ) {
        //   this.setBuscarAsistenciaPorAlumno(this.alumnoSeleccionado);
        // }
        break;
      case 2:
        this.titulo = 'Calificaciones del Alumno';
        console.log('CALIFICACIONES');
        // if (
        //   (!this.calificaciones && this.alumnoSeleccionado) ||
        //   (this.calificaciones && this.calificaciones.length > 0 && this.alumnoSeleccionado._id !== this.calificaciones[0].alumno._id)
        // ) {
        //   this.setBuscarCalificacionesPorAlumno(this.alumnoSeleccionado);
        // }
        break;
      case 3:
        this.titulo = 'Libro de Temas del Profesor';
        console.log('LIBRO DE TEMAS');
        // if (!this.temas) {
        //   this.obtenerLibroDeTemas();
        // }
        break;
      case 4:
        this.titulo = 'Seguimiento del Alumno';
        console.log('SEGUIMIENTO DE ALUMNOS');
        // if (
        //   (!this.seguimientos && this.alumnoSeleccionado) ||
        //   (this.seguimientos && this.seguimientos.length > 0 && this.alumnoSeleccionado._id !== this.seguimientos[0].alumno._id)
        // ) {
        //   this.setBuscarSeguimientosPorAlumno(this.alumnoSeleccionado);
        // }
        break;
      case 5:
        this.titulo = 'Informes';
        console.log('INFORMES');
        break;

      default:
        break;
    }
  }
  //   Output Asistencias
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
}
