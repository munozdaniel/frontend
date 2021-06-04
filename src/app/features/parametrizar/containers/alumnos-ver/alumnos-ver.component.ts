import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AlumnoService } from 'app/core/services/alumno.service';
import { IAlumno } from 'app/models/interface/iAlumno';
import { IEstadoCursada } from 'app/models/interface/iEstadoCursada';
import { CursadaFormComponent } from 'app/shared/components/cursada-form/cursada-form.component';
@UntilDestroy()
@Component({
  selector: 'app-alumnos-ver',
  template: `
    <button-volver></button-volver>
    <div *ngIf="alumno; else cargandoAlumno" fxLayout="column" class="w-100-p p-12 mt-16">
      <div class="w-100-p p-24" fxLayout="column">
        <app-alumnos-menu-param
          [titulo]="'Ver Alumno'"
          [cargando]="cargando"
          [soloLectura]="true"
          (retHabilitarEdicion)="habilitarEdicion($event)"
        >
        </app-alumnos-menu-param>
        <app-alumnos-ver-ui
          [cargando]="cargando"
          [alumno]="alumno"
          (retAgregarCursada)="setAgregarCursada($event)"
          (retEditarCursada)="setEditarCursada($event)"
        ></app-alumnos-ver-ui>
      </div>
    </div>
    <ng-template #cargandoAlumno>
      <div fxLayout="column" fxLayoutAlign="start center" class="w-100-p text-center  p-24">
        <div
          class="mat-card mat-elevation-z4 w-100-p mb-24"
          style="margin-top: 60px;"
          fxLayout="row wrap"
          fxLayoutAlign="space-between center"
        >
          <div fxLayout="row" fxFlex="100" fxLayoutAlign="start center">
            <h1 class="px-12">Ver Alumno</h1>
            <mat-spinner matSuffix class="ml-10" diameter="20"></mat-spinner>
          </div>
        </div>
        <mat-progress-bar mode="indeterminate" class="w-100-p"> </mat-progress-bar>
        <mat-card style="height:200px; width:100%;" fxLayout="row" fxLayoutAlign="center center">
          <div>Cargando datos...</div>
        </mat-card>
      </div>
    </ng-template>

    <!-- <ng-container #cargandoDatos>
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
        <div class="mat-card mat-elevation-z4 p-24 h-400"></div>
    </ng-container> -->
  `,
  styles: [],
})
export class AlumnosVerComponent implements OnInit {
  cargando = false;
  resetear = false;
  alumno: IAlumno;
  alumnoId: string;
  constructor(
    private _dialog: MatDialog,
    private _alumnoService: AlumnoService,
    private _activeRoute: ActivatedRoute,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.recuperarDatos();
  }
  recuperarDatos() {
    this._activeRoute.params.subscribe((params) => {
      this.cargando = true;
      this.alumnoId = params['id'];
      this._alumnoService
        .obtenerAlumnoPorId(this.alumnoId)
        .pipe(untilDestroyed(this))
        .subscribe(
          (datos) => {
            this.cargando = false;
            this.alumno = datos;
          },
          (error) => {
            console.log('[ERROR]', error);
          }
        );
    });
  }
  habilitarEdicion() {
    this._router.navigate(['/parametrizar/alumnos-editar/' + this.alumnoId]);
  }
  setAgregarCursada() {
    const dialogRef = this._dialog.open(CursadaFormComponent, {
      width: '50%',
      data: { esModal: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // this.recuperarDatos();
        this.guardarEstadoCursada(result.estadoCursada);
      }
    });
  }
  guardarEstadoCursada(estadoCursada: IEstadoCursada) {
    this._alumnoService
      .agregarEstadoCursada(estadoCursada, this.alumnoId)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          //   this.alumno.estadoCursadas.push(estadoCursada);
          this.recuperarDatos();
        },
        (error) => {
          console.log('[ERROR]', error);
        }
      );
  }
  actualizarEstadoCursada(estadoCursada: IEstadoCursada, _id: string) {
    this._alumnoService
      .actualizarEstadoCursada(estadoCursada, _id)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          //   const index = this.alumno.estadoCursadas.findIndex((x) => x._id.toString() === estadoCursada._id.toString());
          //   if (index === -1) {
          //     this.alumno.estadoCursadas = [estadoCursada];
          //   } else {
          //     this.alumno.estadoCursadas[index] = estadoCursada;
          //   }
        },
        (error) => {
          console.log('[ERROR]', error);
        }
      );
  }
  setEditarCursada(evento: IEstadoCursada) {
    const dialogRef = this._dialog.open(CursadaFormComponent, {
      width: '50%',
      data: { esModal: true, estadoCursada: evento },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.actualizarEstadoCursada(result.estadoCursada, evento._id);
      }
    });
  }
}
