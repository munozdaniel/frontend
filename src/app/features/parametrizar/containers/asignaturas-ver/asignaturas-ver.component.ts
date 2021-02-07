import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { designAnimations } from '@design/animations';
import { AsignaturaService } from 'app/core/services/asignatura.service';
import { IAsignatura } from 'app/models/interface/iAsignatura';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-asignaturas-ver',
  template: `
    <button-volver></button-volver>
    <!-- <div *ngIf="asignatura$ | async as asignatura; else cargandoAsignatura" fxLayout="column" class="w-100-p p-12 mt-16">
      <div fxLayout="row" fxLayoutAlign="space-between start">
        <h1>Ver Asignatura</h1>
        <button mat-raised-button color="primary" [disabled]="!asignatura" (click)="habilitarEdicion()">Habilitar Edición</button>
      </div> -->
    <div *ngIf="asignatura$ | async as asignatura; else cargandoAsignatura" fxLayout="column" fxLayoutGap="20px" class="w-100-p p-12 mt-40">
      <div fxLayout="column" class="mat-card mat-elevation-z4 p-24 ">
        <div fxLayout fxLayoutAlign="start center" class="w-100-p mb-12" style="border-bottom: 2px solid #80808057">
          <h1 [@animate]="{ value: '*', params: { x: '50px' } }" class="px-12">{{ titulo }}</h1>
          <mat-spinner *ngIf="cargando" matSuffix class="ml-10" diameter="20"></mat-spinner>
        </div>
        <div fxLayout="row" fxLayoutAlign="space-between baseline">
          <div fxLayout fxLayoutAlign="end center" fxFlex="25"></div>
          <button mat-raised-button color="primary" [disabled]="!asignatura" (click)="habilitarEdicion()">Habilitar Edición</button>
        </div>
      </div>
      <app-asignaturas-form
        [soloLectura]="true"
        [asignatura]="asignatura"
        [resetear]="resetear"
        [cargando]="cargando"
      ></app-asignaturas-form>
    </div>
    <ng-template #cargandoAsignatura
      ><div fxLayout="column" fxLayoutAlign="center center" class="w-100-p text-center">
        <mat-progress-bar mode="indeterminate" class="w-100-p"> </mat-progress-bar>
        <mat-card style="height:200px; width:100%;">Cargando datos...</mat-card>
      </div></ng-template
    >
  `,
  styles: [],
  animations: [designAnimations],
})
export class AsignaturasVerComponent implements OnInit {
  titulo = 'Detalle Asignatura';
  cargando = false;
  resetear = false;
  asignatura$: Observable<IAsignatura>;
  asignaturaId: string;
  constructor(private _asignaturaService: AsignaturaService, private _activeRoute: ActivatedRoute, private _router: Router) {}

  ngOnInit(): void {
    this.recuperarDatos();
  }
  recuperarDatos() {
    this._activeRoute.params.subscribe((params) => {
      this.asignaturaId = params['id'];
      this.asignatura$ = this._asignaturaService.obtenerAsignaturaPorId(this.asignaturaId).pipe(finalize(() => (this.cargando = false)));
    });
  }
  habilitarEdicion() {
    this._router.navigate(['/parametrizar/asignaturas-editar/' + this.asignaturaId]);
  }
}
