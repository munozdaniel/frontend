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
    <div fxLayout="column" class="w-100-p p-24" fxLayoutGap="20px">
      <div fxLayout="column" class="mat-card mat-elevation-z4 p-24">
        <div fxLayout fxLayoutAlign="start center" class="w-100-p mb-12" style="border-bottom: 2px solid #80808057;">
          <h1 [@animate]="{ value: '*', params: { x: '50px' } }" class="px-12">{{ titulo }}</h1>
          <mat-spinner *ngIf="cargando" matSuffix class="ml-10" diameter="20"></mat-spinner>
        </div>
        <div fxLayout.xs="column" fxLayout.gt-xs="row wrap" fxLayoutAlign="space-between baseline" fxLayoutGap.xs="20px"></div>
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
  planillasTaller: IPlanillaTaller;
  constructor(private _activeRoute: ActivatedRoute, private _planillaTallerService: PlanillaTallerService) {}

  ngOnInit(): void {
    this._activeRoute.params.subscribe((params) => {
      this.planillaId = params['id'];
      this.cargando = true;
      this._planillaTallerService
        .obtenerPlanillaTallerPorId(this.planillaId)
        .pipe(untilDestroyed(this))
        .subscribe(
          (datos) => {
            console.log('datos', datos);
            this.planillasTaller = datos;
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
