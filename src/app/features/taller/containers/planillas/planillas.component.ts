import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthService } from 'app/core/auth/auth.service';
import { CicloLectivoService } from 'app/core/services/ciclo-lectivo.service';
import { PlanillaTallerService } from 'app/core/services/planillaTaller.service';
import { RolConst } from 'app/models/constants/rol.enum';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import { IPlanillaTallerParam } from 'app/models/interface/iPlanillaTallerParams';
import * as moment from 'moment';
import { NgxPermissionsService } from 'ngx-permissions';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
@UntilDestroy()
@Component({
  selector: 'app-planillas',
  template: `
    <div fxLayout="column" class="w-100-p p-24" fxLayoutGap="20px">
      <div fxLayout="column" class="mat-card mat-elevation-z4 p-24">
        <div fxLayout="row" fxLayoutAlign="start center" class="w-100-p mb-12" style="border-bottom: 2px solid #80808057;">
          <h1 [@animate]="{ value: '*', params: { x: '50px' } }" class="px-12">{{ titulo }}</h1>
          <mat-spinner *ngIf="cargando" matSuffix class="ml-10" diameter="20"></mat-spinner>
        </div>
        <div fxLayout.xs="column" fxLayout.gt-xs="row wrap" fxLayoutAlign="space-between baseline" fxLayoutGap="0px" fxLayoutGap.xs="20px">
          <app-form-ciclo-lectivo
            fxFlex.gt-xs="40"
            fxFlex.xs="100"
            class="w-100-p"
            [cicloLectivo]="cicloActual"
            (retParametrosBusqueda)="setParametrosBusqueda($event)"
          ></app-form-ciclo-lectivo>
          <button
            *ngxPermissionsOnly="['ADMIN', 'JEFETALLER']"
            mat-raised-button
            fxFlex.gt-xs="40"
            fxFlex.xs="100"
            color="primary"
            (click)="redireccionar()"
            class="w-100-p"
          >
            <mat-icon>add</mat-icon>Agregar Planilla
          </button>
        </div>
      </div>
      <!--  -->
      <app-planillas-tabla
        [cargando]="cargando"
        [planillaParams]="planillaParams"
        [planillas]="planillas"
        (retEditarPlanilla)="setEditarPlanilla($event)"
        (retEliminarPlanilla)="setEliminarPlanilla($event)"
        (retPlanillaParams)="setPlanillaParams($event)"
      ></app-planillas-tabla>
    </div>
  `,
  styles: [],
  animations: [designAnimations],
})
export class PlanillasComponent implements OnInit, OnDestroy {
  planillaParams: IPlanillaTallerParam;
  cargando = false;
  titulo = 'Planillas de Taller';
  planillas: IPlanillaTaller[];
  cicloActual: number;
  permisos;
  mostrarEliminados = false;
  constructor(
    private _permissionsService: NgxPermissionsService,
    private _cicloLectivoService: CicloLectivoService,
    private _router: Router,
    private _planillaTallerService: PlanillaTallerService,
    private _authService: AuthService
  ) {
    this.suscripcionPlanillaParams();
    this.obtenerPlanillaPorPermisos();
  }
  ngOnDestroy(): void {}

  ngOnInit(): void {}
  obtenerPlanillaPorPermisos() {
    this.mostrarEliminados = false;

    this._permissionsService.permissions$.subscribe((permissions) => {
      this.permisos = Object.keys(permissions);
      if (this.permisos && this.permisos.length > 0) {
        const index = this.permisos.findIndex((x) => x.toString() === RolConst.PROFESOR);
        if (index !== -1) {
          // Es perofesor
          this.ultimoCiclo(false);
        } else {
          // No es profesor
          const index2 = this.permisos.findIndex((x) => x.toString() === RolConst.ADMIN || x.toString() === RolConst.JEFETALLER);
          if (index2 !== -1) {
            this.mostrarEliminados = true;
            this.ultimoCiclo(true);
          } else {
            this.planillas = [];
          }
        }
      }
    });
  }
  suscripcionPlanillaParams() {
    this._planillaTallerService.planillaParams$.pipe(untilDestroyed(this)).subscribe((datos) => {
      this.planillaParams = { ...datos };
    });
  }
  setPlanillaParams(evento: IPlanillaTallerParam) {
    // this.planillaParams = { ...evento };
    this._planillaTallerService.setPlanillaParams(evento);
  }
  //   Si es profesor solo trae las planillas de el. Si es admini o jefetaller trae todas
  ultimoCiclo(allPlanilla: boolean) {
    this._cicloLectivoService.cicloLectivo$.pipe(untilDestroyed(this)).subscribe((cicloLectivo) => {
      this.cicloActual = cicloLectivo ? cicloLectivo : moment().year();
      if (allPlanilla) {
        this.recuperarPlanillasPorCiclo(this.cicloActual);
      } else {
        this.recuperarPlanillasPorCicloProfesor(this.cicloActual);
      }
    });
  }
  recuperarPlanillasPorCicloProfesor(cicloLectivo: number) {
    this._authService.currentUser$.pipe(untilDestroyed(this)).subscribe(
      (usuario) => {
        if (usuario) {
          this._planillaTallerService
            //   .obtenerPlanillaTalleresPorCiclo( this.cicloActual)
            .obtenerPlanillaTalleresPorCicloPorProfesor(cicloLectivo, usuario.profesor, this.mostrarEliminados)
            .pipe(untilDestroyed(this))
            .subscribe(
              (datos) => {
                this.planillas = [...datos];
              },
              (error) => {
                console.log('[ERROR]', error);
              }
            );
        }
      },
      (error) => {
        console.log('[ERROR]', error);
      }
    );
  }
  recuperarPlanillasPorCiclo(cicloLectivo: number) {
    this._planillaTallerService
      //   .obtenerPlanillaTalleresPorCiclo( this.cicloActual)
      .obtenerPlanillaTalleresPorCiclo(cicloLectivo, this.mostrarEliminados)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.planillas = [...datos];
        },
        (error) => {
          console.log('[ERROR]', error);
        }
      );
  }

  setParametrosBusqueda({ cicloLectivo }) {
    this._cicloLectivoService.setCicloLectivo(cicloLectivo);
    // this.recuperarPlanillasPorCiclo(cicloLectivo);
  }
  redireccionar() {
    this._router.navigate(['taller/planillas-agregar']);
  }
  setEditarPlanilla(evento: IPlanillaTaller) {}
  setEliminarPlanilla(evento: IPlanillaTaller) {
    console.log(evento);
    Swal.fire({
      title: '¿Está seguro de continuar?',
      html: 'Está a punto de <strong>ELIMINAR PERMANENTEMENTE</strong> la planilla',
      icon: 'warning',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this._planillaTallerService.eliminarPlanillaTaller(evento._id).pipe(
          catchError((error) => {
            console.log('[ERROR]', error);
            Swal.fire({
              title: 'Oops! Ocurrió un error',
              text: error && error.error ? error.error.message : 'Error de conexion',
              icon: 'error',
            });
            return of(error);
          }),
          untilDestroyed(this)
        );
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result: any) => {
      if (result.isConfirmed) {
        if (result.value) {
          Swal.fire({
            title: 'Operación Exitosa',
            text: 'La planilla de taller ha sido eliminada correctamente.',
            icon: 'success',
          });
          this.obtenerPlanillaPorPermisos();
        } else {
          Swal.fire({
            title: 'Oops! Ocurrió un error',
            text: 'Intentelo nuevamente. Si el problema persiste comuniquese con el soporte técnico.',
            icon: 'error',
          });
        }
      }
    });
  }
}
