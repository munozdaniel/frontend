import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AlumnoService } from 'app/core/services/alumno.service';
import { IAlumno } from 'app/models/interface/iAlumno';
import { AlumnoDatosPdfComponent } from 'app/shared/components/alumno-datos-pdf/alumno-datos-pdf.component';
import Swal from 'sweetalert2';
@UntilDestroy()
@Component({
  selector: 'app-ficha-alumno-detalle',
  template: `
    <div fxLayout="column" class="w-100-p p-24" fxLayoutGap="20px">
      <button-volver></button-volver>
      <div class="mat-card mat-elevation-z4 p-24 mt-12" fxLayout="row wrap" fxLayoutAlign="space-between center">
        <div fxLayout fxLayoutAlign="start center">
          <h1 [@animate]="{ value: '*', params: { x: '50px' } }" class="px-12">{{ titulo }}</h1>
          <mat-spinner *ngIf="cargando" matSuffix class="ml-10" diameter="20"></mat-spinner>
        </div>
        <div fxFlex.xs="100" fxFlex.gt-xs="45"></div>
      </div>
      <!-- ===== -->
      <app-alumno-datos-pdf [cargando]="cargando" [alumno]="alumno"> </app-alumno-datos-pdf>
    </div>
  `,
  styles: [],
  animations: [designAnimations],
})
export class FichaAlumnoDetalleComponent implements OnInit {
  cargando = false;
  titulo = 'Ficha de alumno/a';
  alumno: IAlumno;
  alumnoId: string;
  constructor(private _router: Router, private _activeRoute: ActivatedRoute, private _alumnoService: AlumnoService) {}

  ngOnInit(): void {
    this._activeRoute.params.subscribe((params) => {
      this.alumnoId = params['id'];
      this.obtenerAlumno();
    });
  }
  obtenerAlumno() {
    this.cargando = true;
    this._alumnoService
      .obtenerAlumnoPorId(this.alumnoId)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          console.log('>>>', datos);
          this.alumno = { ...datos };
          this.cargando = false;
        },
        (error) => {
          this.cargando = false;
          Swal.fire({
            title: 'Alumno no encontrado',
            text: 'Puede que el registro que busca ya no se encuentre disponible',
            icon: 'error',
          });
          this._router.navigate(['/taller/ficha-alumno']);
          console.log('[ERROR]', error);
        }
      );
  }
}
