import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-ciclo-lectivo',
  templateUrl: './form-ciclo-lectivo.component.html',
  styles: [],
})
export class FormCicloLectivoComponent implements OnInit, OnChanges {
  @Input() cargando: boolean;
  @Input() cicloLectivo: number;
  @Output() retParametrosBusqueda = new EventEmitter<number>();
  form: FormGroup;
  anios = [];
  constructor(private _fb: FormBuilder) {
    const actual = moment().year();
    for (let index = 10; index > 0; index--) {
      this.anios.unshift(actual - index);
    }
    this.anios.unshift(actual);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.cicloLectivo && changes.cicloLectivo.currentValue) {
      this.setForm();
    }
  }

  ngOnInit(): void {
    this.form = this._fb.group({
      cicloLectivo: [moment().year(), Validators.required],
    });
  }
  setForm() {
    if (!this.form) {
      setTimeout(() => {
        this.setForm();
      }, 1000);
    } else {
      this.form.controls.cicloLectivo.setValue(this.cicloLectivo);
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
    this.retParametrosBusqueda.emit(this.form.value);
  }
}
