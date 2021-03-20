import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AlumnoService } from 'app/core/services/alumno.service';
import { AsistenciaService } from 'app/core/services/asistencia.service';
import { PlanillaTallerService } from 'app/core/services/planillaTaller.service';
import { IAlumno } from 'app/models/interface/iAlumno';
import { IAsistencia } from 'app/models/interface/iAsistencia';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';

@UntilDestroy()
@Component({
  selector: 'app-tomar-asistencia',
  template: `
    <button-volver></button-volver>
    <div fxLayout="column" class="w-100-p p-24 mt-50" fxLayoutGap="20px">
      <div fxLayout="column" class="mat-card mat-elevation-z4 p-24">
        <div fxLayout fxLayoutAlign="start center" class="w-100-p mb-12" style="border-bottom: 2px solid #80808057;">
          <h1 [@animate]="{ value: '*', params: { x: '50px' } }" class="px-12">{{ titulo }}</h1>
          <mat-spinner *ngIf="cargando" matSuffix class="ml-10" diameter="20"></mat-spinner>
        </div>
        <div
          *ngIf="planillaTaller"
          [@animate]="{ value: '*', params: { x: '50px' } }"
          fxLayout="row"
          fxLayoutAlign.xs="space-between start"
          fxLayoutAlign.gt-xs="start start"
        >
          <div fxLayout="column" class="text-center" fxFlex.gt-md="25">
            <strong>CURSO</strong> <span>{{ planillaTaller.curso.curso }}</span>
          </div>
          <div fxLayout="column" class="text-center" fxFlex="25">
            <strong>DIV</strong> <span>{{ planillaTaller.curso.division }}</span>
          </div>
          <div fxLayout="column" class="text-center" fxFlex="25">
            <strong>COMISION</strong> <span>{{ planillaTaller.curso.comision }}</span>
          </div>
          <div fxLayout="column" class="text-center" fxFlex="25">
            <strong>CICLO</strong> <span>{{ planillaTaller.cicloLectivo.anio }}</span>
          </div>
        </div>
      </div>
      <app-administrar-asistencias [cargandoAlumnos]="cargandoAlumnos" [alumnos]="alumnos"></app-administrar-asistencias>
    </div>
  `,
  styles: [],
  animations: [designAnimations],
})
export class TomarAsistenciaComponent implements OnInit {
  planillaId;
  titulo = 'Tomar Asistencias';
  cargando: boolean;
  // PlanillaTaller
  planillaTaller: IPlanillaTaller;
  //   Alumnos
  cargandoAlumnos = false;
  alumnos: IAlumno[];
  alumnoSeleccionado: IAlumno;
  //   Asistencias
  cargandoAsistencias = false;
  asistencias: IAsistencia[];
  constructor(
    private _activeRoute: ActivatedRoute,
    private _alumnoService: AlumnoService,
    private _asistenciaService: AsistenciaService,
    private _planillaTallerService: PlanillaTallerService
  ) {}

  ngOnInit(): void {
    this._activeRoute.params.subscribe((params) => {
      this.planillaId = params['id'];
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
          this.planillaTaller = { ...datos };
          this.cargando = false;
          this.obtenerAlumnosPorCursoDivisionCiclo()
        },
        (error) => {
          this.cargando = false;
          console.log('[ERROR]', error);
        }
      );
  }
//   obtenerAsistenciaDelAlumnos() {
//     this.cargandoAsistencias = true;
//     this._asistenciaService
//       .obtenerAsistenciasPorPlanilla(this.planillaId)
//       .pipe(untilDestroyed(this))
//       .subscribe(
//         (datos) => {
//           console.log('obtenerAlumnosPorCursoCiclo', datos);
//           this.asistencias = datos;
//           this.cargandoAsistencias = false;
//         },
//         (error) => {
//           this.cargandoAsistencias = false;
//           console.log('[ERROR]', error);
//         }
//       );
//   }
    obtenerAlumnosPorCursoDivisionCiclo() {
      this.cargandoAlumnos = true;
      const { curso, division } = this.planillaTaller.curso;
      this._alumnoService
        .obtenerAlumnosPorCursoDivisionCiclo(curso, division, this.planillaTaller.cicloLectivo.anio)
        .pipe(untilDestroyed(this))
        .subscribe(
          (datos) => {
            this.alumnos = datos;
            this.cargandoAlumnos = false;
          },
          (error) => {
            this.cargandoAlumnos = false;
            console.log('[ERROR]', error);
          }
        );
    }
}
