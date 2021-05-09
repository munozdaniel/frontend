import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SeguimientoAlumnoService } from 'app/core/services/seguimientoAlumno.service';
import { ISeguimientoAlumno } from 'app/models/interface/iSeguimientoAlumno';
import Swal from 'sweetalert2';
@UntilDestroy()
@Component({
  selector: 'app-seguimiento-editar',
  template: `
    <div fxLayout="column" class="w-100-p p-24" fxLayoutGap="20px">
      <button-volver></button-volver>
      <div class="mat-card mat-elevation-z4 p-24 mt-12" fxLayout="row" fxLayoutAlign="space-between center">
        <div fxLayout fxLayoutAlign="start center">
          <h1 [@animate]="{ value: '*', params: { x: '50px' } }" class="px-12">{{ titulo }}</h1>
          <mat-spinner *ngIf="cargando" matSuffix class="ml-10" diameter="20"></mat-spinner>
        </div>
      </div>
      <!-- ===== -->
      <app-seguimiento-form [cargando]="cargando" [seguimiento]="seguimiento" (retActualizar)="setActualizar($event)">
      </app-seguimiento-form>
    </div>
  `,
  styles: [],
  animations: [designAnimations],
})
export class SeguimientoEditarComponent implements OnInit {
  titulo = 'Editar Seguimiento de Alumno';
  cargando = false;
  seguimiento: ISeguimientoAlumno;
  seguimientoId: string;
  constructor(private _activeRoute: ActivatedRoute, private _seguimientoAlumnoService: SeguimientoAlumnoService, private _router: Router) {}

  ngOnInit(): void {
    this._activeRoute.params.subscribe((params) => {
      this.seguimientoId = params['id'];
      this.obtenerSeguimiento();
    });
  }
  obtenerSeguimiento() {
    this.cargando = true;
    this._seguimientoAlumnoService
      .obtenerSeguimientoPorId(this.seguimientoId)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.seguimiento = { ...datos.seguimiento };
          this.cargando = false;
        },
        (error) => {
          this.cargando = false;
          Swal.fire({
            title: 'Seguimiento de alumno no encontrado',
            text: 'Puede que el registro que busca ya no se encuentre disponible',
            icon: 'error',
          });
          this._router.navigate(['taller/seguimiento-alumnos']);
          console.log('[ERROR]', error);
        }
      );
  }
  setActualizar(evento: ISeguimientoAlumno) {
    this.cargando = true;

    const seguimiento: ISeguimientoAlumno = {
      ...evento,
      activo: true,
      fechaCreacion: new Date(),
    };
    this._seguimientoAlumnoService
      .actualizarSeguimientoAlumno(this.seguimiento._id, seguimiento)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          Swal.fire({
            title: 'Seguimiento actualizado',
            text: 'Los datos fueron actualizados correctamente',
            icon: 'success',
          });
          this.cargando = false;
        },
        (error) => {
          this.cargando = false;
          console.log('[ERROR]', error);
          Swal.fire({
            title: 'Ocurrió un error',
            text: 'No se pudo guardar el seguimiento. Intentelo nuevamente y si el problema persiste comuniquese con el soporte tecnico',
            icon: 'error',
          });
        }
      );
  }
}
