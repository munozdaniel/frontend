import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AlumnoService } from 'app/core/services/alumno.service';
import { AsignaturaService } from 'app/core/services/asignatura.service';
import { IAlumno } from 'app/models/interface/iAlumno';
import { ASIGNATURA_KEY, IAsignatura } from 'app/models/interface/iAsignatura';

import { Observable, of } from 'rxjs';
import { startWith, switchMap, delay, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
@UntilDestroy()
@Component({
  selector: 'app-alumnos-por-taller',
  templateUrl: './alumnos-por-taller.component.html',
  styleUrls: ['./alumnos-por-taller.component.scss'],
  animations: [designAnimations],
})
export class AlumnosPorTallerComponent implements OnInit {
  titulo = 'Alumnos por Taller';
  cargando = false;
  pairKeyAsignatura = ASIGNATURA_KEY;
  asignaturas$: Observable<IAsignatura[]>;
  form: FormGroup;
  alumnos: IAlumno[];
  constructor(private _fb: FormBuilder, private _alumnoService: AlumnoService, private _asignaturaService: AsignaturaService) {}

  ngOnInit(): void {
    this.form = this._fb.group({
      asignatura: [null, [Validators.required]],
    });
    this.obtenerAsignaturas();
  }
  obtenerAsignaturas() {
    this.cargando = true;
    this._asignaturaService
      .obtenerAsignaturasHabilitadas()
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this._configurarAsignaturaAutocomplete(datos);
          this.cargando = false;
        },
        (error) => {
          this.cargando = false;
          console.log('[ERROR]', error);
        }
      );
  }
  _configurarAsignaturaAutocomplete(asignaturasList: IAsignatura[]) {
    this.asignaturas$ = this.form.get('asignatura').valueChanges.pipe(
      startWith(null),
      switchMap((name) => {
        if (typeof name === 'string') {
          return of(asignaturasList).pipe(
            delay(800),
            map((response) => response.filter((p) => p.detalle.toUpperCase().includes(name)))
          );
        }
        return of([]);
      })
    );
  }
  obtenerInforme() {
    if (this.form.invalid) {
      Swal.fire({
        title: 'Asignatura no disponible',
        text: 'La asignatura seleccionada no es válida',
        icon: 'error',
      });
      return;
    }
    const { asignatura } = this.form.value;
    this.cargando = true;
    this._alumnoService
      .obtenerAlumnosAsignatura(asignatura)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.cargando = false;
          this.alumnos = datos;
        },
        (error) => {
          this.cargando = false;
          console.log('[ERROR]', error);
        }
      );
  }
}
