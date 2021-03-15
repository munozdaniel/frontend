import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ICicloLectivo } from 'app/models/interface/iCicloLectivo';
import { IFichaAlumnoParam } from 'app/models/interface/iFichaAlumnoParam';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-busqueda-alumnos',
  templateUrl: './form-busqueda-alumnos.component.html',
  styleUrls: ['./form-busqueda-alumnos.component.scss'],
})
export class FormBusquedaAlumnosComponent implements OnInit {
  @Input() ciclosLectivos: ICicloLectivo[];
  @Input() cargando: boolean;
  @Output() retParametrosBusqueda = new EventEmitter<IFichaAlumnoParam>();
  form: FormGroup;
  constructor(private _fb: FormBuilder) {
  
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
