import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CicloLectivoService } from 'app/core/services/ciclo-lectivo.service';
import { AuthenticationService } from 'app/core/services/helpers/authentication.service';
import { PlanillaTallerService } from 'app/core/services/planillaTaller.service';
import { RolConst } from 'app/models/constants/rol.enum';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import * as moment from 'moment';
import { NgxPermissionsService } from 'ngx-permissions';
@UntilDestroy()
@Component({
  selector: 'app-planillas',
  template: `
    <div fxLayout="column" class="w-100-p p-24" fxLayoutGap="20px">
      <div fxLayout="column" class="mat-card mat-elevation-z4 p-24">
        <div fxLayout="row" fxLayoutAlign="start center" class="w-100-p mb-12" style="border-bottom: 2px solid #80808057;">
          <h1 [@animate]="{ value: '*', params: { x: '50px' } }" class="px-12">{{ titulo }}</h1>
          <mat-spinner *ngIf="cargando" matSuffix class="ml-10" diameter="20"></mat-spinner>
        </div>
        <div fxLayout.xs="column" fxLayout.gt-xs="row wrap" fxLayoutAlign="space-between baseline" fxLayoutGap="0px" fxLayoutGap.xs="20px">
          <app-form-ciclo-lectivo
            fxFlex.gt-xs="40"
            fxFlex.xs="100"
            class="w-100-p"
            [cicloLectivo]="cicloActual"
            (retParametrosBusqueda)="setParametrosBusqueda($event)"
          ></app-form-ciclo-lectivo>
          <button
            *ngxPermissionsOnly="['ADMIN', 'JEFETALLER']"
            mat-raised-button
            fxFlex.gt-xs="40"
            fxFlex.xs="100"
            color="primary"
            (click)="redireccionar()"
            class="w-100-p"
          >
            <mat-icon>add</mat-icon>Agregar Planilla
          </button>
        </div>
      </div>
      <!--  -->
      <app-planillas-tabla
        [cargando]="cargando"
        [planillas]="planillas"
        (retEditarPlanilla)="setEditarPlanilla($event)"
        (retEliminarPlanilla)="setEliminarPlanilla($event)"
      ></app-planillas-tabla>
    </div>
  `,
  styles: [],
  animations: [designAnimations],
})
export class PlanillasComponent implements OnInit, OnDestroy {
  cargando = false;
  titulo = 'Planillas de Taller';
  planillas: IPlanillaTaller[];
  cicloActual: number;
  permisos;
  constructor(
    private _permissionsService: NgxPermissionsService,
    private _cicloLectivoService: CicloLectivoService,
    private _router: Router,
    private _planillaTallerService: PlanillaTallerService,
    private _authService: AuthenticationService
  ) {
    this._permissionsService.permissions$.subscribe((permissions) => {
      this.permisos = Object.keys(permissions);
      if (this.permisos && this.permisos.length > 0) {
        const index = this.permisos.findIndex((x) => x.toString() === RolConst.PROFESOR);
        if (index !== -1) {
          // Es perofesor
          this.ultimoCiclo(false);
        } else {
          // No es profesor
          const index2 = this.permisos.findIndex((x) => x.toString() === RolConst.ADMIN || x.toString() === RolConst.JEFETALLER);
          if (index2 !== -1) {
            this.ultimoCiclo(true);
          } else {
            this.planillas = [];
          }
        }
      }
    });
  }
  ngOnDestroy(): void {}

  ngOnInit(): void {}
  //   Si es profesor solo trae las planillas de el. Si es admini o jefetaller trae todas
  ultimoCiclo(allPlanilla: boolean) {
    this._cicloLectivoService.cicloLectivo$.pipe(untilDestroyed(this)).subscribe((cicloLectivo) => {
      this.cicloActual = cicloLectivo ? cicloLectivo : moment().year();
      if (allPlanilla) {
        this.recuperarPlanillasPorCiclo(this.cicloActual);
      } else {
        this.recuperarPlanillasPorCicloProfesor(this.cicloActual);
      }
    });
  }
  recuperarPlanillasPorCicloProfesor(cicloLectivo: number) {
    this._authService.currentUser$.pipe(untilDestroyed(this)).subscribe(
      (usuario) => {
        if (usuario) {
          this._planillaTallerService
            //   .obtenerPlanillaTalleresPorCiclo( this.cicloActual)
            .obtenerPlanillaTalleresPorCicloPorProfesor(cicloLectivo, usuario.profesor)
            .pipe(untilDestroyed(this))
            .subscribe(
              (datos) => {
                this.planillas = [...datos];
              },
              (error) => {
                console.log('[ERROR]', error);
              }
            );
        }
      },
      (error) => {
        console.log('[ERROR]', error);
      }
    );
  }
  recuperarPlanillasPorCiclo(cicloLectivo: number) {
    this._planillaTallerService
      //   .obtenerPlanillaTalleresPorCiclo( this.cicloActual)
      .obtenerPlanillaTalleresPorCiclo(cicloLectivo)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.planillas = [...datos];
        },
        (error) => {
          console.log('[ERROR]', error);
        }
      );
  }

  setParametrosBusqueda({ cicloLectivo }) {
    this._cicloLectivoService.setCicloLectivo(cicloLectivo);
    // this.recuperarPlanillasPorCiclo(cicloLectivo);
  }
  redireccionar() {
    this._router.navigate(['taller/planillas-agregar']);
  }
  setEditarPlanilla(evento: IPlanillaTaller) {}
  setEliminarPlanilla(evento: IPlanillaTaller) {}
}
