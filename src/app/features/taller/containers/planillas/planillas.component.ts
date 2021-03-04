import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
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
        <div fxLayout="row" fxLayoutAlign="space-between baseline">
          <app-form-ciclo-lectivo fxFlex="40" (retParametrosBusqueda)="setParametrosBusqueda($event)"></app-form-ciclo-lectivo>
          <button mat-raised-button color="primary" (click)="redireccionar()"><mat-icon>add</mat-icon>Agregar Planilla</button>
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
  constructor(private _router: Router, private _planillaTallerService: PlanillaTallerService) {}
  ngOnDestroy(): void {}

  ngOnInit(): void {
    // Carga inicial
    this.cicloActual = moment().year();
    this.recuperarPlanillasPorCiclo(2019);
  }
  recuperarPlanillasPorCiclo(cicloLectivo: number) {
    console.log('cicloLectivo', cicloLectivo);
    this._planillaTallerService
      //   .obtenerPlanillaTalleresPorCiclo( this.cicloActual)
      .obtenerPlanillaTalleresPorCiclo(cicloLectivo)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          console.log('datos', datos);
          this.planillas = [...datos];
        },
        (error) => {
          console.log('[ERROR]', error);
        }
      );
  }
  setParametrosBusqueda({ cicloLectivo }) {
    this.recuperarPlanillasPorCiclo(cicloLectivo);
  }
  redireccionar() {
    this._router.navigate(['taller/planillas-agregar']);
  }
  setEditarPlanilla(evento: IPlanillaTaller) {}
  setEliminarPlanilla(evento: IPlanillaTaller) {}
}
