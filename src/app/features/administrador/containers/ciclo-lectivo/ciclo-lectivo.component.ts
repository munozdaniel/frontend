import { Component, OnInit } from '@angular/core';
import { designAnimations } from '@design/animations';

@Component({
  selector: 'app-ciclo-lectivo',
  template: `
    <div fxLayout="column" class="w-100-p p-24" fxLayoutGap="20px">
      <div fxLayout="column" class="mat-card mat-elevation-z4 p-24">
        <div fxLayout fxLayoutAlign="start center" class="w-100-p mb-12" style="border-bottom: 2px solid #80808057">
          <h1 [@animate]="{ value: '*', params: { x: '50px' } }" class="px-12">{{ titulo }}</h1>
          <mat-spinner *ngIf="cargando" matSuffix class="ml-10" diameter="20"></mat-spinner>
        </div>
        <div fxLayout="row" fxLayoutAlign="space-between baseline">
          <div fxLayout fxLayoutAlign="end center" fxFlex="25"></div>
        </div>
      </div>
      <!--  -->
    </div>
  `,
  styles: [],
  animations: [designAnimations],
})
export class CicloLectivoComponent implements OnInit {
  titulo = 'Crear Ciclo Lectivo';
  cargando = false;
  constructor() {}

  ngOnInit(): void {}
}
