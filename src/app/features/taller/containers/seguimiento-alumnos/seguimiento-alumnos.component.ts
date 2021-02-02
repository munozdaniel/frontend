import { Component, OnInit } from '@angular/core';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AlumnoService } from 'app/core/services/alumno.service';
import { SeguimientoAlumnoService } from 'app/core/services/seguimientoAlumno.service';
import { ALUMNO_OPERACION } from 'app/models/constants/alumno-operacion.enum';
import { TipoSeguimiento } from 'app/models/constants/tipo-seguimiento.const';
import { IAlumno } from 'app/models/interface/iAlumno';
import Swal from 'sweetalert2';
@UntilDestroy()
@Component({
  selector: 'app-seguimiento-alumnos',
  template: `
    <div fxLayout="column" class="w-100-p p-24" fxLayoutGap="20px">
      <div class="mat-card mat-elevation-z4 p-24" fxLayout="row" fxLayoutAlign="space-between center">
        <div fxLayout fxLayoutAlign="start center">
          <h1 [@animate]="{ value: '*', params: { x: '50px' } }" class="px-12">{{ titulo }}</h1>
          <mat-spinner *ngIf="cargando" matSuffix class="ml-10" diameter="20"></mat-spinner>
        </div>

        <div fxLayout fxLayoutAlign="end center">
          <app-tipo-seguimiento-form [cargando]="cargando" (retTipoSeguimiento)="setTipoSeguimiento($event)"></app-tipo-seguimiento-form>
        </div>
      </div>
      <!--  -->
      <app-seguimiento-alumnos-tabla></app-seguimiento-alumnos-tabla>
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
  constructor(private _seguimientoAlumno: SeguimientoAlumnoService) {}

  ngOnInit(): void {}

  setTipoSeguimiento(evento) {
    Swal.fire({
      title: 'Oops! Ocurrió un error',
      html: 'No se pudieron recuperar los registros de la base de datos. <br> Si el problema persiste comuniquesé con el soporte técnico.',
      icon: 'error',
    });
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
    this._seguimientoAlumno
      .buscarAlumnosPorSeguimiento(resuelto)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          console.log('Datos', datos);
        },
        (error) => {
          console.log('[ERROR]', error);
        }
      );
  }
}
