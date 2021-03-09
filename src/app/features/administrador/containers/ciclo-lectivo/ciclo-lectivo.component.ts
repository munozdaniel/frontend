import { Component, OnInit } from '@angular/core';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AlumnoService } from 'app/core/services/alumno.service';
import { CicloLectivoService } from 'app/core/services/ciclo-lectivo.service';
import { IAlumno } from 'app/models/interface/iAlumno';
import * as moment from 'moment';
@UntilDestroy()
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
      <app-actualizar-alumnos-ciclo [cargando]="cargando" [alumnos]="alumnos" (retBuscarAlumnos)="setBuscarAlumnos($event)">
      </app-actualizar-alumnos-ciclo>
    </div>
  `,
  styles: [],
  animations: [designAnimations],
})
export class CicloLectivoComponent implements OnInit {
  titulo = 'Crear Ciclo Lectivo';
  cargando = false;
  cicloActual: number;
  alumnos: IAlumno[];
  constructor(private _cicloLectivoService: CicloLectivoService, private _alumnoService: AlumnoService) {}

  ngOnInit(): void {
    this._cicloLectivoService.cicloLectivo$.pipe(untilDestroyed(this)).subscribe((cicloLectivo) => {
      this.cicloActual = cicloLectivo ? cicloLectivo : moment().year();
    });
  }
  setBuscarAlumnos({ cicloLectivo, curso, division }) {
    this.cargando = true;
    this._alumnoService
      .obtenerAlumnosPorCursoDivisionCiclo(curso, division, cicloLectivo)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.alumnos = datos;
          this.cargando = false;
        },
        (error) => {
          console.log('[ERROR]', error);
          this.cargando = false;
        }
      );
  }
}
