import { MediaMatcher, BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Xmb } from '@angular/compiler';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AlumnoService } from 'app/core/services/alumno.service';
import { CicloLectivoService } from 'app/core/services/ciclo-lectivo.service';
import { PlanillaTallerService } from 'app/core/services/planillaTaller.service';
import { IAlumno } from 'app/models/interface/iAlumno';
import { ICicloLectivo } from 'app/models/interface/iCicloLectivo';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { PlanillasModalComponent } from '../../ui/planillas-modal/planillas-modal.component';
@UntilDestroy()
@Component({
  selector: 'app-tomar-asistencias',
  template: `
    <button-volver></button-volver>
    <div fxLayout="column" class="w-100-p p-24 mt-50" fxLayoutGap="20px">
      <div fxLayout="column" class="mat-card mat-elevation-z4 p-24">
        <div fxLayout="row wrap" fxLayoutAlign="space-between center" class="w-100-p mb-12" style="border-bottom: 2px solid #80808057;">
          <div>
            <h1 [@animate]="{ value: '*', params: { x: '50px' } }" class="px-12">{{ titulo }}</h1>
            <mat-spinner *ngIf="cargando" matSuffix class="ml-10" diameter="20"></mat-spinner>
          </div>
        </div>
      </div>
      <div fxLayout="row wrap" fxLayoutAlign.gt-xs="space-between start">
        <app-buscar-curso-form fxFlex.gt-xs="40" fxFlex.xs="100" (retBuscarAlumnos)="setBuscarAlumnos($event)"> </app-buscar-curso-form>
        <div fxFlex.gt-xs="55" fxFlex.xs="100" class="w-100-p" fxLayout="column">
          <!-- Alumno -->
          <mat-accordion *ngIf="planilla" class="w-100-p">
            <mat-expansion-panel expanded (opened)="panelOpenState = true" (closed)="panelOpenState = false">
              <mat-expansion-panel-header>
                <mat-panel-title> Planilla</mat-panel-title>
                <mat-panel-description> Información </mat-panel-description>
              </mat-expansion-panel-header>
              <div fxLayout="row wrap" fxLayoutAlign="space-between start">
                <!--  -->
                <div fxFlex.xs="100" fxFlex.gt-xs="45" fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="10px">
                  <strong>Asignatura</strong>
                  <span>{{ planilla.asignatura }}</span>
                </div>

                <!--  -->
                <div fxFlex.xs="100" fxFlex.gt-xs="45" fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="10px">
                  <strong>Profesor</strong>
                  <span>{{ planilla.profesor }}</span>
                </div>
                <!--  -->
                <div fxFlex.xs="100" fxFlex.gt-xs="45" fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="10px">
                  <strong>Fecha de Inicio</strong>
                  <span>{{ planilla.fechaInicio | date: 'dd/MM':'GMT' }}</span>
                </div>
                <!--  -->
                <div fxFlex.xs="100" fxFlex.gt-xs="45" fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="10px">
                  <strong>Fecha de Finalización</strong>
                  <span>{{ planilla.fechaFinalizacion | date: 'dd/MM':'GMT' }}</span>
                </div>
              </div>
            </mat-expansion-panel>
          </mat-accordion>
          <app-alumnos-tabla-asistencias ngClass.xs="mt-24" class="w-100-p" [cargando]="cargando" [alumnos]="alumnos">
          </app-alumnos-tabla-asistencias>
        </div>
      </div>
    </div>
  `,
  styles: [],
  animations: [designAnimations],
})
export class TomarAsistenciasComponent implements OnInit {
  cargando = false;
  titulo = 'Tomar asistencia';
  alumnos: IAlumno[];
  planilla: IPlanillaTaller;
  // Mobile
  isMobile: boolean;
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _media: MediaMatcher,
    public breakpointObserver: BreakpointObserver,
    private _planillaTallerService: PlanillaTallerService,
    private _alumnoService: AlumnoService,
    private _cicloLectivoService: CicloLectivoService,
    public dialog: MatDialog
  ) {
    this.mobileQuery = this._media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this._changeDetectorRef.detectChanges();
    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.HandsetPortrait]).subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
  }

  ngOnInit(): void {}
  setBuscarAlumnos({ curso, comision, division }) {
    this.cargando = true;
    this._cicloLectivoService
      .obtenerCicloActual()
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.obtenerPlanillasPorCursoCiclo(curso, comision, division, datos);
        },
        (error) => {
          this.cargando = false;
          console.log('[ERROR]', error);
        }
      );
  }
  obtenerPlanillasPorCursoCiclo(curso: number, comision: string, division: number, cicloLectivo: ICicloLectivo) {
    this._planillaTallerService
      .obtenerPlanillasPorCursoCiclo(curso, comision, division, cicloLectivo)
      .pipe(
        map((datos) => datos.planillasTaller.map((x) => ({ ...x, profesor: x.profesor.nombreCompleto, asignatura: x.asignatura.detalle }))),
        untilDestroyed(this)
      )
      .subscribe(
        (planillasTaller) => {
          if (planillasTaller && planillasTaller.length < 1) {
            Swal.fire({
              title: 'No hay datos cargados',
              text: 'No se encontraron planillas de taller con los parametros ingresados',
              icon: 'success',
              timer: 2000,
              timerProgressBar: true,
            }).then(() => {});
          } else {
            const dialogRef = this.dialog.open(PlanillasModalComponent, {
              width: this.isMobile ? '100%' : '80%',
              data: { planillas: planillasTaller, isMobile: this.isMobile },
            });

            dialogRef.afterClosed().subscribe((result) => {
              if (result.planilla) {
                this.obtenerAlumnos(curso, comision, division, cicloLectivo);
                this.planilla = result.planila;
              }
            });
          }

          this.cargando = false;
        },
        (error) => {
          this.cargando = false;

          console.log('[ERROR]', error);
        }
      );
  }
  obtenerAlumnos(curso: number, comision: string, division: number, cicloLectivo: ICicloLectivo) {
    this._alumnoService
      .obtenerAlumnosPorCursoEspecifico(curso, comision, division, cicloLectivo)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.alumnos = [...datos];
          this.cargando = false;
        },
        (error) => {
          this.cargando = false;
          console.log('[ERROR]', error);
        }
      );
  }
}
