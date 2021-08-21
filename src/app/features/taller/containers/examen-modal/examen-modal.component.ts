import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CalificacionService } from 'app/core/services/calificacion.service';
import Swal from 'sweetalert2';
@UntilDestroy()
@Component({
  selector: 'app-examen-modal',
  templateUrl: './examen-modal.component.html',
  styleUrls: ['./examen-modal.component.scss'],
})
export class ExamenModalComponent implements OnInit {
  ausente = false;
  form: FormGroup;
  alumnoId: number;
  planillaId: number;
  constructor(
    private _calificacionService: CalificacionService,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<ExamenModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.alumnoId = data.alumnoId;
      this.planillaId = data.planillaId;
    }
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.form = this._fb.group({
      mes: [null, Validators.required],
      nota: [null, Validators.required],
      ausente: [false],
      alumnoId: [this.alumnoId, Validators.required],
      planillaId: [this.planillaId, Validators.required],
    });
  }
  guardarNota() {
    if (this.form.invalid) {
      Swal.fire({
        title: 'Formulario incompleto',
        text: 'Verifique que los datos hayan sido ingresado correctamente',
        icon: 'success',
        timer: 6000,
        timerProgressBar: true,
      }).then(() => {});
      return;
    } else {
      const { mes, nota, alumnoId, planillaId,ausente } = this.form.value;
      this._calificacionService
        .agregarExamen(mes, nota, alumnoId, planillaId, ausente)
        .pipe(untilDestroyed(this))
        .subscribe(
          (datos) => {
            this.dialogRef.close(true);
          },
          (error) => {
            console.log('[ERROR]', error);
          }
        );
    }
  }
  ausentar(evento) {
    this.ausente = !this.ausente;
    this.form.controls.ausente.setValue(this.ausente);
  }
}
