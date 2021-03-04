import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ASIGNATURA_DATA } from 'app/models/data/asignaturaData';
import { IAsignatura } from 'app/models/interface/iAsignatura';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignaturas-form',
  templateUrl: './asignaturas-form.component.html',
  styleUrls: ['./asignaturas-form.component.scss'],
})
export class AsignaturasFormComponent implements OnInit, OnChanges {
  @Input() soloLectura?: boolean = false;
  @Input() asignatura: IAsignatura;
  @Input() cargando: boolean;
  @Input() resetear: boolean;
  @Output() retDatosForm = new EventEmitter<IAsignatura>();
  asignaturaData = ASIGNATURA_DATA;

  formaciones = [
    'Formacion Etica - Ciudadana - Humanistica General',
    'Formacion Cientifico - Tecnologica',
    'Formacion Tecnica - Especifica',
  ];
  ciclos = ['1RO BASICO', '1RO SUPERIOR', '2DO BASICO', '2DO SUPERIOR', '3RO SUPERIOR', '4TO SUPERIOR'];
  tiposAsignatura = ['Materia', 'Taller'];
  form: FormGroup;
  constructor(private _fb: FormBuilder) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.resetear && changes.resetear.currentValue === true) {
      this.form.reset();
    }
    if (changes.asignatura && changes.asignatura.currentValue) {
      console.log('this.asoi', this.asignatura);
      this.setFormularios();
    }
  }
  ngOnInit(): void {
    this.form = this._fb.group({
      detalle: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      tipoAsignatura: [null, [Validators.required]],
      tipoCiclo: [null, [Validators.required]],
      curso: [null, [Validators.required, Validators.min(1), Validators.max(6)]],
      horasCatedraAnuales: [null, [Validators.required]],
      horasCatedraSemanales: [null, [Validators.required]],
      tipoFormacion: [null, [Validators.required]],
      meses: [null, [Validators.required, Validators.min(0)]],
    });
  }
  setFormularios() {
    if (!this.form) {
      setTimeout(() => {
        this.setFormularios();
      }, 1000);
      return;
    }
    console.log('this.asignatura', this.asignatura);
    this.form.patchValue(this.asignatura);
    // this.form.controls.tipoFormacion.setValue(this.asignatura.tipoFormacion);
    this.form.controls.curso.setValue(this.asignatura.curso.toString());
    if (this.soloLectura) {
      this.form.disable();
    }
  }
  setDatosPersonalesTest() {
    this.form.patchValue(this.asignaturaData);
  }
  guardarAsignatura() {
    console.log('this.form.valid', this.form.valid);
    if (this.form.invalid) {
      Swal.fire({
        title: 'Oops! Datos incorrectos',
        text: 'El formulario de los datos personales no está completo. Verifique sus datos.',
        icon: 'error',
      });
      return;
    }

    const asignatura: IAsignatura = {
      ...this.form.value,
      activo: true,
      curso: Number(this.form.controls.curso.value),
    };
    console.log('asignatura', asignatura);
    this.retDatosForm.emit(asignatura);
  }
}
