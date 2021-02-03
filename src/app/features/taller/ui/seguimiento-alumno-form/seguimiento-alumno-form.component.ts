import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAlumno } from 'app/models/interface/iAlumno';
import { ISeguimientoAlumno } from 'app/models/interface/iSeguimientoAlumno';

@Component({
  selector: 'app-seguimiento-alumno-form',
  templateUrl: './seguimiento-alumno-form.component.html',
  styleUrls: ['./seguimiento-alumno-form.component.scss'],
})
export class SeguimientoAlumnoFormComponent implements OnInit {
  @Input() alumno: IAlumno; // Para mostrar los datos nada mas
  @Input() cargando: boolean;
  @Output() retSeguimiento = new EventEmitter<ISeguimientoAlumno>();
  form: FormGroup;
  constructor(private _fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this._fb.group({
      fecha: [null, [Validators.required]],
      tipoSeguimiento: [null, [Validators.required]],
      cicloLectivo: [null, [Validators.required]],
      resuelto: [null, [Validators.required]],
      observacion: [null, [Validators.required]],
      observacion2: [null, [Validators.required]],
      observacionJefe: [null, [Validators.required]],
    });
  }
}
