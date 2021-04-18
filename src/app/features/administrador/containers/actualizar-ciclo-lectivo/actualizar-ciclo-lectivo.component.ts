import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AlumnoService } from 'app/core/services/alumno.service';
import { CicloLectivoService } from 'app/core/services/ciclo-lectivo.service';
import { IAlumno } from 'app/models/interface/iAlumno';
import { ICicloLectivo } from 'app/models/interface/iCicloLectivo';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { ResultadoCicloTablaComponent } from '../../ui/resultado-ciclo-tabla/resultado-ciclo-tabla.component';
@UntilDestroy()
@Component({
  selector: 'app-actualizar-ciclo-lectivo',
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
      <button *ngIf="ultimosActualizados" mat-raised-button (click)="abrirActualizados()" color="accent">
        Mostrar últimos actualizados
      </button>
      <app-actualizar-alumnos-ciclo
        [cargando]="cargando"
        [alumnos]="alumnos"
        (retLimpiarAlumnos)="setLimpiarAlumnos($event)"
        (retBuscarAlumnos)="setBuscarAlumnos($event)"
        (retActualizarCiclo)="setActualizarCiclo($event)"
      >
      </app-actualizar-alumnos-ciclo>
    </div>
  `,
  styles: [],
  animations: [designAnimations],
})
export class ActualizarCicloLectivoComponent implements OnInit {
  titulo = 'Actualizar Ciclo Lectivo';
  cargando = false;
  cicloActual: number;
  alumnos: IAlumno[];
  ciclosLectivos: ICicloLectivo[];
  ultimosActualizados: any[];
  ultimosNoActualizados: any[];
  constructor(private _dialog: MatDialog, private _cicloLectivoService: CicloLectivoService, private _alumnoService: AlumnoService) {}
  ngOnInit(): void {
    this._cicloLectivoService
      .obtenerCiclosLectivos()
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.ciclosLectivos = datos;
        },
        (error) => {
          console.log('[ERROR]', error);
        }
      );
    this._cicloLectivoService.cicloLectivo$.pipe(untilDestroyed(this)).subscribe((cicloLectivo) => {
      this.cicloActual = cicloLectivo ? cicloLectivo : moment().year();
    });
  }
  setLimpiarAlumnos(evento) {
    this.alumnos = [];
  }
  setBuscarAlumnos({ curso, divisiones, cicloLectivo }) {
    const indexAnterior = this.ciclosLectivos.findIndex((x) => x.anio === cicloLectivo - 1);
    if (indexAnterior === -1) {
      Swal.fire({
        title: 'Ciclo lectivo anterior inválido',
        text: 'El ciclo lectivo que desea agregar no se encuentra habilitado',
        icon: 'error',
      });
      return;
    }
    this.cargando = true;
    this._alumnoService
      .obtenerAlumnosPorCursoDivisionesCiclo(curso, divisiones, this.ciclosLectivos[indexAnterior])
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.alumnos = [...datos];
          this.cargando = false;
        },
        (error) => {
          console.log('[ERROR]', error);
          this.cargando = false;
        }
      );
  }
  setActualizarCiclo({ cicloLectivo, curso, divisiones }) {
    const indexAnterior = this.ciclosLectivos.findIndex((x) => x.anio === cicloLectivo - 1);
    if (indexAnterior === -1) {
      Swal.fire({
        title: 'Ciclo lectivo anterior inválido',
        text: 'El ciclo lectivo que desea agregar no se encuentra habilitado',
        icon: 'error',
      });
      return;
    }
    const index = this.ciclosLectivos.findIndex((x) => x.anio === cicloLectivo);
    if (index === -1) {
      Swal.fire({
        title: 'Ciclo lectivo inválido',
        text: 'El ciclo lectivo que desea agregar no se encuentra habilitado',
        icon: 'error',
      });
      return;
    }
    this.cargando = true;
    this._alumnoService
      .actualizarAlNuevoCiclo(curso, divisiones, this.ciclosLectivos[indexAnterior], this.ciclosLectivos[index])
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.ultimosActualizados = datos.alumnosActualizados;
          this.ultimosNoActualizados = datos.alumnosNoActualizados;
          this.abrirActualizados();

          this.cargando = false;
        },
        (error) => {
          console.log('[ERROR]', error);
          this.cargando = false;
        }
      );
  }
  abrirActualizados() {
    this._dialog.open(ResultadoCicloTablaComponent, {
      width: '70%',
      data: { ultimosActualizados: this.ultimosActualizados, ultimosNoActualizados: this.ultimosNoActualizados },
    });
  }
}
