import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IFichaAlumnoParam } from 'app/models/interface/iFichaAlumnoParam';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-busqueda-alumnos',
  templateUrl: './form-busqueda-alumnos.component.html',
  styleUrls: ['./form-busqueda-alumnos.component.scss'],
})
export class FormBusquedaAlumnosComponent implements OnInit {
  @Input() cargando: boolean;
  @Output() retParametrosBusqueda = new EventEmitter<IFichaAlumnoParam>();
  form: FormGroup;
  anios = [];
  constructor(private _fb: FormBuilder) {
    const actual = moment().year();
    for (let index = 10; index > 0; index--) {
      this.anios.unshift(actual - index);
    }
    this.anios.unshift(actual);
  }

  ngOnInit(): void {
    this.form = this._fb.group({
      cicloLectivo: [null, Validators.required],
      curso: [null, Validators.required],
      division: [null, Validators.required],
    });
  }

  enviarParametros() {
    if (this.form.invalid) {
      Swal.fire({
        title: 'Oops! Datos incorrectos',
        text: 'El formulario no está completo. Verifique sus datos.',
        icon: 'error',
      });
      return;
    }
    const parametros: IFichaAlumnoParam = { ...this.form.value, curso: Number(this.form.controls.curso.value) };
    this.retParametrosBusqueda.emit(parametros);
  }
}
