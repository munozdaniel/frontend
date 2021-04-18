import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AlumnoService } from 'app/core/services/alumno.service';
import { IAlumno } from 'app/models/interface/iAlumno';
import { AgregarCursadaComponent } from 'app/shared/components/agregar-cursada/agregar-cursada.component';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-alumnos-ver',
  template: `
    <button-volver></button-volver>
    <div *ngIf="alumno$ | async as alumno; else cargandoAlumno" fxLayout="column" class="w-100-p p-12 mt-16">
      <div class="w-100-p p-24" fxLayout="column">
        <app-alumnos-menu-param
          [titulo]="'Ver Alumno'"
          [cargando]="cargando"
          [soloLectura]="true"
          (retHabilitarEdicion)="habilitarEdicion($event)"
        >
        </app-alumnos-menu-param>
        <app-alumnos-ver-ui [cargando]="cargando" [alumno]="alumno" (retAgregarCursada)="setAgregarCursada($event)"></app-alumnos-ver-ui>
      </div>
    </div>
    <ng-template #cargandoAlumno>
      <div fxLayout="column" fxLayoutAlign="center center" class="w-100-p text-center">
        <mat-progress-bar mode="indeterminate" class="w-100-p"> </mat-progress-bar>
        <mat-card style="height:200px; width:100%;">Cargando datos...</mat-card>
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
  alumno$: Observable<IAlumno>;
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
      this.alumnoId = params['id'];
      this.alumno$ = this._alumnoService.obtenerAlumnoPorId(this.alumnoId).pipe(finalize(() => (this.cargando = false)));
    });
  }
  habilitarEdicion() {
    this._router.navigate(['/parametrizar/alumnos-editar/' + this.alumnoId]);
  }
  setAgregarCursada() {
    const dialogRef = this._dialog.open(AgregarCursadaComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(`Dialog result: ${result}`);
      }
    });
  }
}
