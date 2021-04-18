import { Component, EventEmitter, Inject, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CicloLectivoService } from 'app/core/services/ciclo-lectivo.service';
import { COMISION_DATA } from 'app/models/data/comisionData';
import { ICicloLectivo } from 'app/models/interface/iCicloLectivo';
import { IEstadoCursada } from 'app/models/interface/iEstadoCursada';
import Swal from 'sweetalert2';
@UntilDestroy()
@Component({
  selector: 'app-cursada-form',
  templateUrl: './cursada-form.component.html',
  styleUrls: ['./cursada-form.component.scss'],
})
export class CursadaFormComponent implements OnInit {
  @Input() soloLectura?: boolean = false;
  @Input() estadoCursada: IEstadoCursada;
  @Input() cargando: boolean;
  @Input() resetear: boolean;
  @Output() retDatosForm = new EventEmitter<IEstadoCursada>();
  comisionData = COMISION_DATA;
  tiposComision = [0, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  form: FormGroup;
  today = new Date();
  //   anios = [];
  esModal: boolean = false;
  ciclosLectivos: ICicloLectivo[];
  constructor(
    private _cicloLectivoService: CicloLectivoService,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<CursadaFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data.esModal) {
      this.esModal = data.esModal;
      if (data.estadoCursada) {
        this.cargando = true;
        this.estadoCursada = data.estadoCursada;
        this.recuperarCiclosLectivosModal();
      }
    }
    // const actual = moment().year();
    // for (let index = 10; index > 0; index--) {
    //   this.anios.unshift(actual - index);
    // }
    // this.anios.unshift(actual);
  }
  recuperarCiclosLectivosModal() {
    this.cargando = true;
    this._cicloLectivoService
      .obtenerCiclosLectivos()
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.cargando = false;
          this.ciclosLectivos = datos;
          this.setDatosModal();
        },
        (error) => {
          console.log('[ERROR]', error);
        }
      );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.resetear && changes.resetear.currentValue === true) {
      this.form.reset();
    }
    if (changes.estadoCursada && changes.estadoCursada.currentValue) {
      this.recuperarCiclosLectivos();
    }
  }
  ngOnInit(): void {
    this.recuperarCiclosLectivos();
  }
  recuperarCiclosLectivos() {
    this.cargando = true;
    this._cicloLectivoService
      .obtenerCiclosLectivos()
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.cargando = false;
          this.ciclosLectivos = datos;
          this.initForm();
        },
        (error) => {
          console.log('[ERROR]', error);
        }
      );
  }
  initForm() {
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

    this.form.controls.condicion.setValue(this.estadoCursada.condicion);
    this.form.controls.cicloLectivo.setValue(this.ciclosLectivos.find((x) => this.estadoCursada.cicloLectivo._id === x._id));
    this.form.controls.comision.setValue(this.estadoCursada.curso.comision ? this.estadoCursada.curso.comision.toString() : null);
    this.form.controls.curso.setValue(this.estadoCursada.curso.curso.toString());
    this.form.controls.division.setValue(this.estadoCursada.curso.division.toString());
    if (this.soloLectura) {
      this.form.disable();
    }
  }
  setDatosModal() {
    if (!this.form) {
      setTimeout(() => {
        this.setDatosModal();
      }, 1000);
      return;
    }
    // this.form.patchValue(this.estadoCursada);
    this.form.controls.condicion.setValue(this.estadoCursada.condicion);
    this.form.controls.cicloLectivo.setValue(this.ciclosLectivos.find((x) => this.estadoCursada.cicloLectivo._id === x._id));
    this.form.controls.comision.setValue(this.estadoCursada.curso.comision ? this.estadoCursada.curso.comision.toString() : null);
    this.form.controls.curso.setValue(this.estadoCursada.curso.curso.toString());
    this.form.controls.division.setValue(this.estadoCursada.curso.division.toString());
    if (this.soloLectura) {
      this.form.disable();
    }
    this.cargando = false;
  }
  guardarComision() {
    if (this.form.invalid) {
      Swal.fire({
        title: 'Oops! Datos incorrectos',
        text: 'El formulario de los datos personales no está completo. Verifique sus datos.',
        icon: 'error',
      });
      return;
    }

    const estadoCursada: IEstadoCursada = {
      ...this.form.value,
      activo: true,
      curso: {
        curso: Number(this.form.controls.curso.value),
        division: Number(this.form.controls.division.value),
        comision: this.form.controls.comision.value,
      },
    };
    if (this.esModal) {
      this.retornarDatosModal();
    } else {
      this.retDatosForm.emit(estadoCursada);
    }
  }
  retornarDatosModal(): void {
    this.estadoCursada = {
      ...this.form.value,
      activo: true,
      curso: {
        curso: Number(this.form.controls.curso.value),
        division: Number(this.form.controls.division.value),
        comision: this.form.controls.comision.value,
      },
    };
    this.dialogRef.close({ estadoCursada: this.estadoCursada });
  }
}
