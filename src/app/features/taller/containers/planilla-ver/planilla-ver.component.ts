import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AlumnoService } from 'app/core/services/alumno.service';
import { PlanillaTallerService } from 'app/core/services/planillaTaller.service';
import { IAlumno } from 'app/models/interface/iAlumno';
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
            <app-planilla-detalle [planillaTaller]="planillaTaller"></app-planilla-detalle>
          </mat-tab>
          <mat-tab label="Asistencias">
            <app-planilla-detalle-asistencias [cargandoAlumnos]="cargandoAlumnos" [alumnos]="alumnos"></app-planilla-detalle-asistencias
          ></mat-tab>
          <mat-tab label="Calificaciones"> </mat-tab>
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
  constructor(
    private _activeRoute: ActivatedRoute,
    private _alumnoService: AlumnoService,
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
      .obtenerAlumnosPorCurso(curso, division, comision)
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
        break;
      case 1:
        console.log('ASISTENCIAS');
        if (!this.alumnos) {
          //   this.recuperarAsistenciasPorCurso();
        }
        break;
      case 2:
        console.log('CALIFICACIONES');
        break;
      case 3:
        console.log('LIBRO DE TEMAS');
        break;
      case 4:
        console.log('SEGUIMIENTO DE ALUMNOS');
        break;
      case 5:
        console.log('INFORMES');
        break;

      default:
        break;
    }
  }
}
