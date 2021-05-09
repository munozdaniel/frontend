import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CicloLectivoService } from 'app/core/services/ciclo-lectivo.service';
import { PlanillaTallerService } from 'app/core/services/planillaTaller.service';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import * as moment from 'moment';
@UntilDestroy()
@Component({
  selector: 'app-planillas',
  template: `
    <div fxLayout="column" class="w-100-p p-24" fxLayoutGap="20px">
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
          <button mat-raised-button fxFlex.gt-xs="40" fxFlex.xs="100" color="primary" (click)="redireccionar()" class="w-100-p">
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
  constructor(
    private _cicloLectivoService: CicloLectivoService,
    private _router: Router,
    private _planillaTallerService: PlanillaTallerService
  ) {}
  ngOnDestroy(): void {}

  ngOnInit(): void {
    this._cicloLectivoService.cicloLectivo$.pipe(untilDestroyed(this)).subscribe((cicloLectivo) => {
      this.cicloActual = cicloLectivo ? cicloLectivo : moment().year();
      this.recuperarPlanillasPorCiclo(this.cicloActual);
    });
    // Carga inicial
    // this.cicloActual = this.cicloActual ? this.cicloActual : moment().year();
    // this.recuperarPlanillasPorCiclo(this.cicloActual);
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
