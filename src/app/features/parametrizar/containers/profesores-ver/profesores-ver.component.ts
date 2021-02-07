import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { designAnimations } from '@design/animations';
import { ProfesorService } from 'app/core/services/profesor.service';
import { IProfesor } from 'app/models/interface/iProfesor';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-profesores-ver',
  template: `
    <button-volver></button-volver>
    <!-- <div *ngIf="profesor$ | async as profesor; else cargandoProfesor" fxLayout="column" class="w-100-p p-12 mt-16">
      <div fxLayout="row" fxLayoutAlign="space-between start">
        <h1>Ver Profesor</h1>
        <button mat-raised-button color="primary" [disabled]="!profesor" (click)="habilitarEdicion()">Habilitar Edición</button>
      </div> -->
    <div *ngIf="profesor$ | async as profesor; else cargandoProfesor" fxLayout="column" fxLayoutGap="20px" class="w-100-p p-12 mt-40">
      <div fxLayout="column" class="mat-card mat-elevation-z4 p-24 ">
        <div fxLayout fxLayoutAlign="start center" class="w-100-p mb-12" style="border-bottom: 2px solid #80808057">
          <h1 [@animate]="{ value: '*', params: { x: '50px' } }" class="px-12">{{ titulo }}</h1>
          <mat-spinner *ngIf="cargando" matSuffix class="ml-10" diameter="20"></mat-spinner>
        </div>
        <div fxLayout="row" fxLayoutAlign="space-between baseline">
          <div fxLayout fxLayoutAlign="end center" fxFlex="25"></div>
          <button mat-raised-button color="primary" [disabled]="!profesor" (click)="habilitarEdicion()">Habilitar Edición</button>
        </div>
      </div>
      <app-profesores-form [soloLectura]="true" [profesor]="profesor" [resetear]="resetear" [cargando]="cargando"></app-profesores-form>
    </div>
    <ng-template #cargandoProfesor
      ><div fxLayout="column" fxLayoutAlign="center center" class="w-100-p text-center">
        <mat-progress-bar mode="indeterminate" class="w-100-p"> </mat-progress-bar>
        <mat-card style="height:200px; width:100%;">Cargando datos...</mat-card>
      </div></ng-template
    >
  `,
  styles: [],
  animations: [designAnimations],
})
export class ProfesoresVerComponent implements OnInit {
  titulo = 'Detalles Profesor';
  cargando = false;
  resetear = false;
  profesor$: Observable<IProfesor>;
  profesorId: string;
  constructor(private _profesorService: ProfesorService, private _activeRoute: ActivatedRoute, private _router: Router) {}

  ngOnInit(): void {
    this.recuperarDatos();
  }
  recuperarDatos() {
    this._activeRoute.params.subscribe((params) => {
      this.profesorId = params['id'];
      this.profesor$ = this._profesorService.obtenerProfesorPorId(this.profesorId).pipe(finalize(() => (this.cargando = false)));
    });
  }
  habilitarEdicion() {
    this._router.navigate(['/parametrizar/profesores-editar/' + this.profesorId]);
  }
}
