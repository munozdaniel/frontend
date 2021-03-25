import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { designAnimations } from '@design/animations';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-buscar-curso-form',
  templateUrl: './buscar-curso-form.component.html',
  styleUrls: ['./buscar-curso-form.component.scss'],
  animations: [designAnimations],
})
export class BuscarCursoFormComponent implements OnInit {
  form: FormGroup;
  @Output() retBuscarAlumnos = new EventEmitter<any>();
  tiposComision = [0, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  constructor(private _fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this._fb.group({
      curso: [null, [Validators.required]],
      comision: [null, [Validators.required]],
      division: [null, [Validators.required]],
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
    const parametros = { ...this.form.value, curso: Number(this.form.controls.curso.value) };
    this.retBuscarAlumnos.emit(parametros);
  }
}
