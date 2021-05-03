import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PROFESOR_DATA } from 'app/models/data/profesorData';
import { IProfesor } from 'app/models/interface/iProfesor';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profesores-form',
  templateUrl: './profesores-form.component.html',
  styleUrls: ['./profesores-form.component.scss'],
})
export class ProfesoresFormComponent implements OnInit {
  @Input() soloLectura?: boolean = false;
  @Input() profesor: IProfesor;
  @Input() cargando: boolean;
  @Input() resetear: boolean;
  @Output() retDatosForm = new EventEmitter<IProfesor>();
  profesorData = PROFESOR_DATA;
  form: FormGroup;
  constructor(private _fb: FormBuilder) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.resetear && changes.resetear.currentValue === true) {
      this.form.reset();
    }
    if (changes.profesor && changes.profesor.currentValue) {
      this.setFormularios();
    }
  }
  ngOnInit(): void {
    this.form = this._fb.group({
      nombreCompleto: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      telefono: [null, [Validators.required]],
      celular: [null],
      email: [null, [Validators.required, Validators.email]],
      formacion: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      titulo: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    });
  }
  setFormularios() {
    if (!this.form) {
      setTimeout(() => {
        this.setFormularios();
      }, 1000);
      return;
    }

    this.form.patchValue(this.profesor);
    if (this.soloLectura) {
      this.form.disable();
    }
  }
  setDatosPersonalesTest() {
    this.form.patchValue(this.profesorData);
  }
  guardarProfesor() {
    if (this.form.invalid) {
      Swal.fire({
        title: 'Oops! Datos incorrectos',
        text: 'El formulario de los datos personales no está completo. Verifique sus datos.',
        icon: 'error',
      });
      return;
    }

    const profesor: IProfesor = {
      ...this.form.value,
      telefono: this.form.controls.telefono.value.toString(),
      celular: this.form.controls.celular.value.toString(),
      activo: true,
    };
    this.retDatosForm.emit(profesor);
  }
}
