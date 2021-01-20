import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlumnoService } from 'app/core/services/alumno.service';
import { IAlumno } from 'app/models/interface/iAlumno';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-alumnos-ver',
  template: `
    <button-volver></button-volver>
    <div *ngIf="alumno$ | async as alumno; else cargandoAlumno" fxLayout="column" class="w-100-p p-12 mt-16">
      <div fxLayout="row" fxLayoutAlign="space-between start">
        <h1>Ver Alumno</h1>
        <button mat-raised-button color="primary" [disabled]="!alumno" (click)="habilitarEdicion()">Habilitar Edición</button>
      </div>
      <app-alumnos-form [soloLectura]="true" [alumno]="alumno" [resetear]="resetear" [cargando]="cargando"></app-alumnos-form>
    </div>
    <ng-template #cargandoAlumno
      ><div fxLayout="column" fxLayoutAlign="center center" class="w-100-p text-center" >
        <mat-progress-bar  mode="indeterminate" class="w-100-p" > </mat-progress-bar>
        <mat-card style="height:200px; width:100%;">Cargando datos...</mat-card>
      </div></ng-template
    >

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
  alumno$: Observable<IAlumno>;
  alumnoId: string;
  constructor(private _alumnoService: AlumnoService, private _activeRoute: ActivatedRoute, private _router: Router) {}

  ngOnInit(): void {
    this.recuperarDatos();
  }
  recuperarDatos() {
    this._activeRoute.params.subscribe((params) => {
      this.alumnoId = params['id'];
  this.alumno$ = this._alumnoService.obtenerAlumnoPorId(this.alumnoId).pipe(finalize(() => (this.cargando = false)));
    });
  }
  habilitarEdicion() {
    this._router.navigate(['/parametrizar/alumnos-editar/' + this.alumnoId]);
  }
}