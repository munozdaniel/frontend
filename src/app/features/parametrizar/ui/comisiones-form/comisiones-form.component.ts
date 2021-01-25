import { Component, EventEmitter, Inject, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { COMISION_DATA } from 'app/models/data/comisionData';
import { IComision } from 'app/models/interface/iComision';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comisiones-form',
  templateUrl: './comisiones-form.component.html',
  styleUrls: ['./comisiones-form.component.scss'],
})
export class ComisionesFormComponent implements OnInit {
  @Input() soloLectura?: boolean = false;
  @Input() comision: IComision;
  @Input() cargando: boolean;
  @Input() resetear: boolean;
  @Output() retDatosForm = new EventEmitter<IComision>();
  comisionData = COMISION_DATA;
  tiposComision = [0, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  form: FormGroup;
  today = new Date();
  anios = [];
  esModal: boolean = false;
  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<ComisionesFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data.esModal) {
      this.esModal = data.esModal;
      if (data.comision) {
        this.comision = data.comision;
        this.setDatos();
      }
    }
    const actual = moment().year();
    for (let index = 10; index > 0; index--) {
      this.anios.unshift(actual - index);
    }
    this.anios.unshift(actual);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.resetear && changes.resetear.currentValue === true) {
      this.form.reset();
    }
    if (changes.comision && changes.comision.currentValue) {
      console.log('this.asoi', this.comision);
      this.setFormularios();
    }
  }
  ngOnInit(): void {
    this.form = this._fb.group({
      comision: [null, [Validators.required]],
      cicloLectivo: [null, [Validators.required]],
      curso: [null, [Validators.required, Validators.min(0), Validators.max(6)]],
      division: [null, [Validators.required, Validators.min(0), Validators.max(6)]],
      condicion: [null, [Validators.required]],
    });
  }
  setFormularios() {
    if (!this.form) {
      setTimeout(() => {
        this.setFormularios();
      }, 1000);
      return;
    }

    this.form.patchValue(this.comision);
    this.form.controls.curso.setValue(this.comision.curso.toString());
    if (this.soloLectura) {
      this.form.disable();
    }
  }
  test() {
    this.comision = {comisionNro:1, activo: true, cicloLectivo: 2020, comision: 'C', condicion: 'REGULAR', curso: 1, division: 1 };
  }
  setDatos() {
    if (!this.form) {
      setTimeout(() => {
        this.setDatos();
      }, 1000);
      return;
    }
    this.form.patchValue(this.comision);
  }
  guardarComision() {
    console.log('this.form.valid', this.form.valid);
    if (this.form.invalid) {
      Swal.fire({
        title: 'Oops! Datos incorrectos',
        text: 'El formulario de los datos personales no está completo. Verifique sus datos.',
        icon: 'error',
      });
      return;
    }

    const comision: IComision = {
      ...this.form.value,
      activo: true,
      curso: Number(this.form.controls.curso.value),
    };
    console.log('comision', comision);
    if (this.esModal) {
      this.retornarDatosModal();
    } else {
      this.retDatosForm.emit(comision);
    }
  }
  retornarDatosModal(): void {
    this.comision = { ...this.form.value, activo: true };
    this.dialogRef.close({ comision: this.comision });
  }
}
