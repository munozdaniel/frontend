import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ICicloLectivo } from 'app/models/interface/iCicloLectivo';
import { IFichaAlumnoParam } from 'app/models/interface/iFichaAlumnoParam';
import { timeStamp } from 'console';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-busqueda-alumnos',
  templateUrl: './form-busqueda-alumnos.component.html',
  styleUrls: ['./form-busqueda-alumnos.component.scss'],
})
export class FormBusquedaAlumnosComponent implements OnInit, OnChanges {
  @Input() parametros: IFichaAlumnoParam;
  @Input() ciclosLectivos: ICicloLectivo[];
  @Input() cargando: boolean;
  @Output() retParametrosBusqueda = new EventEmitter<IFichaAlumnoParam>();
  form: FormGroup;
  constructor(private _fb: FormBuilder) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ciclosLectivos && changes.ciclosLectivos.currentValue) {
    }
    if (changes.parametros && changes.parametros.currentValue) {
      this.setForm();
    }
  }

  ngOnInit(): void {
    this.form = this._fb.group({
      cicloLectivo: [null, Validators.required],
      curso: [null, Validators.required],
      division: [null, Validators.required],
    });
  }
  setForm() {
    if (!this.form) {
      setTimeout(() => {
        this.setForm();
      }, 1000);
      return;
    } else {
      //   this.form.patchValue({ ...this.parametros });
      const index = this.ciclosLectivos.findIndex((x) => x._id === this.parametros.cicloLectivo._id);
      if (index !== -1) {
        this.form.controls.cicloLectivo.setValue(this.ciclosLectivos[index]);
      }
      this.form.controls.curso.setValue(this.parametros.curso.toString());
      this.form.controls.division.setValue(this.parametros.division);
    }
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
