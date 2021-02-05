import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { designAnimations } from '@design/animations';
import { PlanillaTallerDataSource } from 'app/core/services/paginacion/planilla-taller.datasource';
import { PlanillaTallerService } from 'app/core/services/planillaTaller.service';
import { IPaginado } from 'app/models/interface/iPaginado';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';

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
          <div fxLayout fxLayoutAlign="end center" fxFlex="25"></div>
          <button mat-raised-button color="primary" (click)="redireccionar()"><mat-icon>add</mat-icon>Agregar Planilla</button>
        </div>
      </div>
      <!--  -->
      <app-planillas-tabla
        [cargando]="cargando"
        [dataSource]="dataSource"
        (retEditarPlanilla)="setEditarPlanilla($event)"
        (retEliminarPlanilla)="setEliminarPlanilla($event)"
        (retPaginacion)="setPaginacion($event)"
      ></app-planillas-tabla>
    </div>
  `,
  styles: [],
  animations: [designAnimations],
})
export class PlanillasComponent implements OnInit {
  cargando = false;
  titulo = 'Planillas de Taller';
  planillas: IPlanillaTaller;
  dataSource: PlanillaTallerDataSource;
  constructor(private _router: Router, private _planillaTallerService: PlanillaTallerService) {
    this.dataSource = new PlanillaTallerDataSource(this._planillaTallerService);
  }

  ngOnInit(): void {
    // Carga inicial
    this.dataSource.loadPlanillaTaller('', 'planillaTallerNro', 'desc', 1, 3);
  }
  redireccionar() {
    this._router.navigate(['taller/planillas-agregar']);
  }
  setEditarPlanilla(evento: IPlanillaTaller) {}
  setEliminarPlanilla(evento: IPlanillaTaller) {}
  setPaginacion(evento: IPaginado) {
    if (evento) {
      const { currentPage, pageSize, sortBy, search, sortField } = { ...evento };
      this.dataSource.loadPlanillaTaller(search, sortField, sortBy, currentPage, pageSize);
    }
  }
}
