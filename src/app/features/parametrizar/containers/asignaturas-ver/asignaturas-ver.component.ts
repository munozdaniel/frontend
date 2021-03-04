import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AsignaturaService } from 'app/core/services/asignatura.service';
import { IAsignatura } from 'app/models/interface/iAsignatura';
@UntilDestroy()
@Component({
  selector: 'app-asignaturas-ver',
  template: `
    <button-volver></button-volver>
    <!-- <div *ngIf="asignatura$ | async as asignatura; else cargandoAsignatura" fxLayout="column" class="w-100-p p-12 mt-16">
      <div fxLayout="row" fxLayoutAlign="space-between start">
        <h1>Ver Asignatura</h1>
        <button mat-raised-button color="primary" [disabled]="!asignatura" (click)="habilitarEdicion()">Habilitar Edición</button>
      </div> -->
    <div fxLayout="column" fxLayoutAlign="start start" fxLayoutGap="20px" class="w-100-p p-12 mt-40">
      <div fxLayout="column" class="mat-card mat-elevation-z4 p-24 w-100-p">
        <div fxLayout fxLayoutAlign="start center" class="w-100-p mb-12" style="border-bottom: 2px solid #80808057">
          <h1 [@animate]="{ value: '*', params: { x: '50px' } }" class="px-12">{{ titulo }}</h1>
          <mat-spinner *ngIf="cargando" matSuffix class="ml-10" diameter="20"></mat-spinner>
        </div>
        <div fxLayout="row" fxLayoutAlign="space-between baseline">
          <div fxLayout fxLayoutAlign="end center" fxFlex="25"></div>
          <button mat-raised-button color="primary" [disabled]="!asignatura" (click)="habilitarEdicion()">Habilitar Edición</button>
        </div>
      </div>
      ´

      <div
        *ngIf="!cargando && asignatura"
        class="w-100-p mat-card mat-elevation-z4 p-24"
        fxLayout="row "
        fxLayoutAlign="space-between start"
      >
        <div class="w-100-p detalle" fxFlex.gt-xs="42" fxFlex.xs="100" fxLayout="column">
          <p fxFlex.gt-xs="45" fxFlex.xs="100">
            <strong>Detalle:</strong><span>{{ asignatura.detalle }}</span>
          </p>
          <p fxFlex.gt-xs="45" fxFlex.xs="100">
            <strong>Tipo Asignatura:</strong><span>{{ asignatura.tipoAsignatura }}</span>
          </p>
          <p fxFlex.gt-xs="45" fxFlex.xs="100">
            <strong>Tipo de Ciclo:</strong><span>{{ asignatura.tipoCiclo }}</span>
          </p>
          <p fxFlex.gt-xs="45" fxFlex.xs="100">
            <strong>Curso:</strong><span>CURSO {{ asignatura.curso }}</span>
          </p>
        </div>
        <div class="w-100-p detalle" fxFlex.gt-xs="42" fxFlex.xs="100" fxLayout="column">
          <p fxFlex.gt-xs="45" fxFlex.xs="100">
            <strong>Horas Catedra Anual:</strong><span>{{ asignatura.horasCatedraAnuales }}</span>
          </p>
          <p fxFlex.gt-xs="45" fxFlex.xs="100">
            <strong>Horas Catedra Semanal:</strong><span>{{ asignatura.horasCatedraSemanales }}</span>
          </p>
          <p fxFlex.gt-xs="45" fxFlex.xs="100">
            <strong>Formación:</strong><span>{{ asignatura.tipoFormacion }}</span>
          </p>
          <p fxFlex.gt-xs="45" fxFlex.xs="100">
            <strong>Meses:</strong><span>{{ asignatura.meses }}</span>
          </p>
        </div>
      </div>

      <ng-template #mostrarVacio>
        <div fxLayout="column" fxLayoutAlign="center center" class="w-100-p text-center mat-card mat-elevation-z4">
          <h2>No se encontró la asignatura</h2>
        </div></ng-template
      >
    </div>
  `,
  styles: [
    `
      .detalle > p > strong {
        margin-right: 8px;
      }
    `,
  ],
  animations: [designAnimations],
})
export class AsignaturasVerComponent implements OnInit {
  titulo = 'Detalle Asignatura';
  cargando = false;
  resetear = false;
  asignatura: IAsignatura;
  asignaturaId: string;
  constructor(private _asignaturaService: AsignaturaService, private _activeRoute: ActivatedRoute, private _router: Router) {}

  ngOnInit(): void {
    this.recuperarDatos();
  }
  recuperarDatos() {
    this._activeRoute.params.subscribe((params) => {
      this.asignaturaId = params['id'];
      console.log(' this.asignaturaId', this.asignaturaId);
      console.log(' this.asignaturaId', this.asignaturaId);
      this.obtenerAsignaturaPorId();
    });
  }
  obtenerAsignaturaPorId() {
    this.cargando = true;
    this._asignaturaService
      .obtenerAsignaturaPorId(this.asignaturaId)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.asignatura = datos;
          this.cargando = false;
        },
        (error) => {
          this.cargando = false;
          console.log('[ERROR]', error);
        }
      );
  }
  habilitarEdicion() {
    this._router.navigate(['/parametrizar/asignaturas-editar/' + this.asignaturaId]);
  }
}
