import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IAdulto } from 'app/models/interface/iAdulto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-adultos-form',
  templateUrl: './adultos-form.component.html',
  styleUrls: ['./adultos-form.component.scss'],
})
export class AdultosFormComponent implements OnInit {
  formAdulto: FormGroup;
  adulto: IAdulto;
  edicion = false;
  constructor(private _fb: FormBuilder, public dialogRef: MatDialogRef<AdultosFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data && data.adulto) {
      this.edicion = true;
      this.formInit(data.adulto);
    } else {
      this.edicion = false;
      this.formInit();
    }
  }

  ngOnInit(): void {}
  formInit(adulto?: IAdulto) {
    this.formAdulto = this._fb.group({
      tipoAdulto: [adulto ? adulto.tipoAdulto : null, [Validators.required]],
      nombreCompleto: [adulto ? adulto.nombreCompleto : null, [Validators.required]],
      telefono: [adulto ? adulto.telefono : null, []],
      celular: [adulto ? adulto.celular : null, []],
      email: [adulto ? adulto.email : null, [Validators.required, Validators.email]],
    });
  }
  agregarAdulto() {
    if (this.formAdulto.valid) {
      this.adulto = { ...this.formAdulto.value, activo: true };
      this.dialogRef.close(this.adulto);
    } else {
      Swal.fire({
        title: 'Oops! Datos incorrectos',
        text: 'Verifique que el formulario haya sido completado correctamente.',
        icon: 'error',
      });
    }
  }
}
