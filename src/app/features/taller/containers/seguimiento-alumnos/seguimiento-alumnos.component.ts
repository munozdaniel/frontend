import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AlumnoService } from 'app/core/services/alumno.service';
import { SeguimientoAlumnoService } from 'app/core/services/seguimientoAlumno.service';
import { ALUMNO_OPERACION } from 'app/models/constants/alumno-operacion.enum';
import { TipoSeguimiento } from 'app/models/constants/tipo-seguimiento.const';
import { IAlumno } from 'app/models/interface/iAlumno';
import { ISeguimientoAlumno } from 'app/models/interface/iSeguimientoAlumno';
import Swal from 'sweetalert2';
@UntilDestroy()
@Component({
  selector: 'app-seguimiento-alumnos',
  template: `
    <div fxLayout="column" class="w-100-p p-24" fxLayoutGap="20px">
      <div fxLayout="column" class="mat-card mat-elevation-z4 p-24">
        <div fxLayout fxLayoutAlign="start center" class="w-100-p mb-12" style="border-bottom: 2px solid #80808057;">
          <h1 [@animate]="{ value: '*', params: { x: '50px' } }" class="px-12">{{ titulo }}</h1>
          <mat-spinner *ngIf="cargando" matSuffix class="ml-10" diameter="20"></mat-spinner>
        </div>
        <div fxLayout="row wrap" fxLayoutAlign="space-between baseline" style="gap:20px">
          <div fxLayout fxLayoutAlign.xs="start center" fxLayoutAlign.gt-xs="end center" fxFlex.gt-xs="35" fxFlex.xs="100">
            <app-tipo-seguimiento-form
              [cargando]="cargando"
              (retTipoSeguimiento)="setTipoSeguimiento($event)"
              class="w-100-p"
            ></app-tipo-seguimiento-form>
          </div>
          <button mat-raised-button color="primary" fxFlex.gt-xs="35" fxFlex.xs="100" (click)="redireccionar()">
            <mat-icon>add</mat-icon>Agregar Seguimiento
          </button>
        </div>
      </div>
      <!--  -->
      <app-seguimiento-alumnos-tabla
        [cargando]="cargando"
        [seguimientoAlumnos]="seguimientoAlumnos"
        (retEditar)="setEditar($event)"
        (retEliminar)="setEliminar($event)"
      ></app-seguimiento-alumnos-tabla>
    </div>
  `,
  styles: [],
  animations: [designAnimations],
})
export class SeguimientoAlumnosComponent implements OnInit {
  titulo = 'Registro de seguimiento de alumnos ';
  cargando = false;
  alumnoOperacion = ALUMNO_OPERACION;
  tipoSeguimiento = TipoSeguimiento[0];
  seguimientoAlumnos: ISeguimientoAlumno[];
  constructor(private _router: Router, private _seguimientoAlumno: SeguimientoAlumnoService) {}

  ngOnInit(): void {
    this.buscarAlumnosPorSeguimiento(false);
  }

  redireccionar() {
    this._router.navigate(['taller/agregar-seguimiento']);
  }
  setTipoSeguimiento(evento) {
    let resuelto = null;
    switch (evento.valor) {
      case 1:
        resuelto = true;
        break;
      case 2:
        resuelto = false;
        break;
      default:
        break;
    }
    this.buscarAlumnosPorSeguimiento(resuelto);
  }
  buscarAlumnosPorSeguimiento(resuelto?: boolean) {
    this.cargando = true;
    this._seguimientoAlumno
      .buscarAlumnosPorSeguimiento(resuelto)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.cargando = false;
          this.seguimientoAlumnos = [...datos];
        },
        (error) => {
          console.log('[ERROR]', error);
          this.cargando = false;
        }
      );
  }
  setEditar(seguimiento: ISeguimientoAlumno) {}
  setEliminar(seguimiento: ISeguimientoAlumno) {}
}
