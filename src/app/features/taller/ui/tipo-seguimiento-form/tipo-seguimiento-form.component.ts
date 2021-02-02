import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TipoSeguimiento } from 'app/models/constants/tipo-seguimiento.const';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-seguimiento-form',
  templateUrl: './tipo-seguimiento-form.component.html',
  styleUrls: ['./tipo-seguimiento-form.component.scss'],
})
export class TipoSeguimientoFormComponent implements OnInit {
  @Input() cargando: boolean;
  @Output() retTipoSeguimiento = new EventEmitter<number>();
  form: FormGroup;
  tiposSegumientos = TipoSeguimiento;
  constructor(private _fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this._fb.group({
      tipoSeguimiento: [TipoSeguimiento[0], [Validators.required]],
    });
  }
  enviarTipoSegumiento() {
    if (this.form.invalid) {
      Swal.fire({
        title: 'Oops! Datos incorrectos',
        text: 'El formulario de los datos personales no está completo. Verifique sus datos.',
        icon: 'error',
      });
      return;
    }
    this.retTipoSeguimiento.emit(this.form.controls.tipoSeguimiento.value);
  }
}
