import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PlanillaTallerService } from 'app/core/services/planillaTaller.service';
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

        <div *ngIf="planillaTaller" fxLayout="column" fxLayoutGap="10px">
          <h2 fxLayout="row" fxLayoutGap="10px">
            <strong>Año Lectivo </strong><span>{{ planillaTaller.curso?.cicloLectivo[0].anio }}</span>
          </h2>
          <!--  -->
          <div fxLayout.xs="column" fxLayout.gt-xs="row wrap" fxLayoutAlign="start baseline" fxLayoutGap.xs="20px">
            <div fxLayout="row wrap" fxLayoutAlign="start center" fxLayoutGap="10px" fxFlex.gt-xs="30" fxFlex.xs="100">
              <mat-icon fxHide.xs="true">calendar_today</mat-icon>
              <h3 fxLayout="row" fxLayoutGap="10px">
                <strong>Fecha de Inicio:</strong><span>{{ planillaTaller.fechaInicio | date: 'dd/MM/yyyy' }}</span>
              </h3>
            </div>
            <div fxLayout="row wrap" fxLayoutAlign="start center" fxLayoutGap="10px" fxFlex.gt-xs="30" fxFlex.xs="100">
              <mat-icon fxHide.xs="true">calendar_today</mat-icon>
              <h3 fxLayout="row" fxLayoutGap="10px">
                <strong>Fecha de Finalización:</strong><span>{{ planillaTaller.fechaFinalizacion | date: 'dd/MM/yyyy' }}</span>
              </h3>
            </div>
          </div>
          <!--  -->
          <div class="p-24 border">
            <h2 fxLayout="row" fxLayoutGap="10px">
              <strong>CURSO </strong>
            </h2>
            <div fxLayout="row wrap" fxLayoutAlign="start center">
              <h3 fxLayout="row" fxLayoutGap="10px" fxFlex.xs="100" fxFlex.gt-xs="30">
                <strong>Curso:</strong><span>{{ planillaTaller.curso.curso }}</span>
              </h3>
              <h3 fxLayout="row" fxLayoutGap="10px" fxFlex.xs="100" fxFlex.gt-xs="30">
                <strong>División:</strong><span>{{ planillaTaller.curso.division }}</span>
              </h3>
              <h3 *ngIf="planillaTaller.curso.comision" fxLayout="row" fxLayoutGap="10px" fxFlex.xs="100" fxFlex.gt-xs="30">
                <strong>Comisión:</strong><span>{{ planillaTaller.curso.comision }}</span>
              </h3>
            </div>
          </div>
          <!--  -->
          <div class="p-24 border">
            <h2 fxLayout="row" fxLayoutGap="10px">
              <strong>ASIGNATURA </strong>
            </h2>
            <div fxLayout="row wrap" fxLayoutAlign="start center">
              <h3 fxLayout.xs="column" fxLayout.gt-xs="row" fxLayoutGap="10px" fxFlex.xs="100" fxFlex.gt-xs="40">
                <strong>Descripción:</strong><span>{{ planillaTaller.asignatura.detalle }}</span>
              </h3>
              <h3 fxLayout.xs="column" fxLayout.gt-xs="row" fxLayoutGap="10px" fxFlex.xs="100" fxFlex.gt-xs="40">
                <strong>Tipo:</strong><span>{{ planillaTaller.asignatura.tipoAsignatura }}</span>
              </h3>
            </div>
            <div fxLayout="row wrap" fxLayoutAlign="start center">
              <h3 fxLayout.xs="column" fxLayout.gt-xs="row" fxLayoutGap="10px" fxFlex.xs="100" fxFlex.gt-xs="40">
                <strong>Ciclo:</strong><span>{{ planillaTaller.asignatura.tipoCiclo }}</span>
              </h3>
              <h3 fxLayout.xs="column" fxLayout.gt-xs="row" fxLayoutGap="10px" fxFlex.xs="100" fxFlex.gt-xs="40">
                <strong>Formación:</strong><span>{{ planillaTaller.asignatura.tipoFormacion }}</span>
              </h3>
            </div>
          </div>
          <!--  -->
          <div class="p-24 border">
            <h2 fxLayout="row" fxLayoutGap="10px">
              <strong>PROFESOR </strong>
            </h2>
            <div fxLayout="row wrap" fxLayoutAlign="space-between center">
              <h3 fxLayout.xs="column" fxLayout.gt-xs="row" fxLayoutGap="10px" fxFlex.xs="100" fxFlex.gt-xs="50">
                <strong>Nombre Completo:</strong><span>{{ planillaTaller.profesor.nombreCompleto }}</span>
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
  animations: [designAnimations],
})
export class PlanillaVerComponent implements OnInit {
  titulo = 'Planilla';
  cargando = false;
  planillaId: string;
  ciclo: number;
  planillaTaller: IPlanillaTaller;
  constructor(private _activeRoute: ActivatedRoute, private _planillaTallerService: PlanillaTallerService) {}

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
            this.cargando = false;
          },
          (error) => {
            this.cargando = false;
            console.log('[ERROR]', error);
          }
        );
    });
  }
}
