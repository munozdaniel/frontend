import { EventEmitter, Component, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from 'app/core/services/general/validation.services';
import { ASIGNATURA_KEY, IAsignatura } from 'app/models/interface/iAsignatura';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import { IProfesor, PROFESOR_KEY } from 'app/models/interface/iProfesor';
import { CONFIG_PROVIDER } from 'app/shared/config.provider';
import * as moment from 'moment';
import { Observable, of } from 'rxjs';
import { startWith, switchMap, delay, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-planilla-form',
  templateUrl: './planilla-form.component.html',
  styleUrls: ['./planilla-form.component.scss'],
  providers: CONFIG_PROVIDER,
})
export class PlanillaFormComponent implements OnInit, OnChanges {
  @Input() planillaTaller?: IPlanillaTaller;
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
  actualizar = false;
  minimo;
  maximo;
  constructor(private _fb: FormBuilder) {
    var thisYear = new Date().getFullYear();
    this.minimo = new Date('1/1/' + thisYear);
    this.maximo = new Date('12/31/' + thisYear);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.cargandoProfesores && changes.cargandoProfesores.currentValue) {
    }
    if (changes.profesores && changes.profesores.currentValue) {
      this._configurarProfesoresAutocomplete(changes.profesores.currentValue);
    }
    if (changes.asignaturas && changes.asignaturas.currentValue) {
      this._configurarAsignaturaAutocomplete(changes.asignaturas.currentValue);
    }
    if (changes.planillaTaller && changes.planillaTaller.currentValue) {
      this.setFormulario();
      this.actualizar = true;
    }
  }

  ngOnInit(): void {
    this.form = this._fb.group(
      {
        cicloLectivo: [moment().year(), [Validators.required]],
        fechaInicio: [null, [Validators.required]],
        fechaFinalizacion: [null, [Validators.required]],
        curso: [null, [Validators.required]],
        comision: [null, [Validators.required]],
        division: [null, [Validators.required]],
        bimestre: [null, [Validators.required]],
        asignatura: [null, [Validators.required]],
        profesor: [null, [Validators.required]],
        turno: [null, [Validators.required]],
        observacion: [null, [Validators.maxLength(150), Validators.minLength(5)]],
      },
      {
        validator: [ValidationService.desdeMenorEstrictoHasta('fechaInicio', 'fechaFinalizacion')], // validator: ValidationService.restriccionFechaConHoras('fechaDesde', 'fechaHasta', 'horaDesde', 'horaHasta')
      }
    );
    const actual = moment().year();
    for (let index = 10; index > 0; index--) {
      this.anios.unshift(actual - index);
    }
    this.anios.unshift(actual);
  }
  setFormulario() {
    if (!this.form) {
      setTimeout(() => {
        this.setFormulario();
      }, 1000);
    } else {
      this.form.patchValue(this.planillaTaller);
      this.form.controls.fechaInicio.setValue(moment.utc(this.planillaTaller.fechaInicio));
      this.form.controls.fechaFinalizacion.setValue(moment.utc(this.planillaTaller.fechaFinalizacion));
      this.form.controls.cicloLectivo.setValue(this.planillaTaller.cicloLectivo.anio);
      this.form.controls.cicloLectivo.disable();
      this.form.controls.curso.setValue(this.planillaTaller.curso.curso.toString());
      this.form.controls.comision.setValue(this.planillaTaller.curso.comision.toString());
      this.form.controls.division.setValue(this.planillaTaller.curso.division);
      this.form.controls.asignatura.setValue(this.planillaTaller.asignatura);
      this.form.controls.profesor.setValue(this.planillaTaller.profesor);
    }
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
