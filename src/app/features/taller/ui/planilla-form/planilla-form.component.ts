import { EventEmitter, Component, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { untilDestroyed } from '@ngneat/until-destroy';
import { ASIGNATURA_KEY, IAsignatura } from 'app/models/interface/iAsignatura';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import { IProfesor, PROFESOR_KEY } from 'app/models/interface/iProfesor';
import * as moment from 'moment';
import { Observable, of } from 'rxjs';
import { startWith, switchMap, delay, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-planilla-form',
  templateUrl: './planilla-form.component.html',
  styleUrls: ['./planilla-form.component.scss'],
})
export class PlanillaFormComponent implements OnInit, OnChanges {
  @Input() cargando: boolean;
  @Input() cargandoProfesores: boolean;
  @Input() cargandoAsignaturas: boolean;
  @Input() profesores: IProfesor[];
  @Input() asignaturas: IAsignatura[];
  @Output() retPlanilla = new EventEmitter<IPlanillaTaller>();
  form: FormGroup;
  tiposComision = [0, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  today = new Date();
  anios = [];
  //   Autocomplete profesores
  pairKeyProfesor = PROFESOR_KEY;
  profesores$: Observable<IProfesor[]>;
  //   Autocomplete asignaturas
  pairKeyAsignatura = ASIGNATURA_KEY;
  asignaturas$: Observable<IAsignatura[]>;
  //
  constructor(private _fb: FormBuilder) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.cargandoProfesores && changes.cargandoProfesores.currentValue) {
      console.log('cargandoProfesores', this.cargandoProfesores);
    }
    if (changes.profesores && changes.profesores.currentValue) {
      console.log('cargandoProfesores', this.profesores);
      this._configurarProfesoresAutocomplete(changes.profesores.currentValue);
    }
    if (changes.asignaturas && changes.asignaturas.currentValue) {
      this._configurarAsignaturaAutocomplete(changes.asignaturas.currentValue);
    }
  }

  ngOnInit(): void {
    this.form = this._fb.group({
      cicloLectivo: [null, [Validators.required]],
      fechaInicio: [null, [Validators.required]],
      fechaFinalizacion: [null, [Validators.required]],
      curso: [null, [Validators.required]],
      comision: [null, [Validators.required]],
      division: [null, [Validators.required]],
      bimestre: [null, [Validators.required]],
      asignatura: [null, [Validators.required]],
      profesor: [null, [Validators.required]],
      observacion: [null],
    });
    const actual = moment().year();
    for (let index = 10; index > 0; index--) {
      this.anios.unshift(actual - index);
    }
    this.anios.unshift(actual);
  }
  _configurarProfesoresAutocomplete(profesoresList: IProfesor[]) {
    if (this.form) {
      this.profesores$ = this.form.get('profesor').valueChanges.pipe(
        startWith(null),
        switchMap((name) => {
          if (typeof name === 'string') {
            return of(profesoresList).pipe(
              delay(800),
              map((response) => response.filter((p) => p.nombreCompleto.toUpperCase().includes(name)))
            );
          }
          return of([]);
        })
      );
    } else {
      delay(1000);
      this._configurarProfesoresAutocomplete(profesoresList);
    }
  }
  _configurarAsignaturaAutocomplete(asignaturasList: IAsignatura[]) {
    if (this.form) {
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
    } else {
      setTimeout(() => {
        this._configurarAsignaturaAutocomplete(asignaturasList);
      }, 1000);
    }
  }

  setCicloLectivo(evento: number) {
    if (evento) {
      this.form.controls.cicloLectivo.setValue(evento);
    }
  }
  guardar() {
    if (this.form.invalid) {
      Swal.fire({
        title: 'Oops! Datos incorrectos',
        text: 'El formulario no está completo. Verifique sus datos.',
        icon: 'error',
      });
      return;
    }
    this.retPlanilla.emit(this.form.value);
  }
}
