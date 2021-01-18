import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ALUMNO_DATA } from 'app/models/constants/alumnoData';
import { NACIONALIDADES } from 'app/models/constants/nacionalidad';
import { IAdulto } from 'app/models/interface/iAdulto';
import { IAlumno } from 'app/models/interface/iAlumno';
import { CONFIG_PROVIDER } from 'app/shared/config.provider';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-alumnos-form',
  templateUrl: './alumnos-form.component.html',
  styleUrls: ['./alumnos-form.component.scss'],
  providers: CONFIG_PROVIDER, // Para el time
})
export class AlumnosFormComponent implements OnInit, OnChanges {
  @Input() cargando: boolean;
  @Input() resetear: boolean;
  @Output() retDatosForm = new EventEmitter<IAlumno>();
  //
  formDatosPersonales: FormGroup;
  formEtap: FormGroup;
  formAdulto: FormGroup;
  nacionalidades = NACIONALIDADES;

  adultos: IAdulto[] = [];
  alumnoData = ALUMNO_DATA;
  alumno: IAlumno;
  seguimientoEtap = false;
  constructor(private _fb: FormBuilder) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.resetear && changes.resetear.currentValue === true) {
      this.formDatosPersonales.reset();
      this.adultos = [];
      this.formEtap.reset();
      this.formAdulto.reset();
    }
  }

  ngOnInit(): void {
    this.formDatosPersonales = this._fb.group({
      tipoDni: [null, [Validators.required]],
      dni: [null, [Validators.required, Validators.minLength(7), Validators.maxLength(9)]],
      nombreCompleto: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],
      sexo: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(9)]],
      fechaNacimiento: [null, [Validators.required]],
      nacionalidad: [null, [Validators.required]],
      observacionTelefono: [null, [Validators.minLength(3), Validators.maxLength(50)]],
      telefono: [null, [Validators.minLength(7), Validators.maxLength(20)]],
      celular: [null, [Validators.minLength(7), Validators.maxLength(20)]],

      email: [null, [Validators.required, Validators.email, Validators.minLength(4), Validators.maxLength(50)]],
      fechaIngreso: [null, [Validators.required]],
      procedenciaColegioPrimario: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      procedenciaColegioSecundario: [null, [Validators.minLength(4), Validators.maxLength(50)]],
      fechaDeBaja: [null, []],
      motivoDeBaja: [null, [Validators.minLength(4), Validators.maxLength(50)]],
      domicilio: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      cantidadIntegranteGrupoFamiliar: [null, [Validators.required]],

      observacion: [null, [Validators.minLength(4), Validators.maxLength(100)]],
      activo: [true],
    });
    this.formEtap = this._fb.group({
      nombreCompletoTae: [null, [Validators.required]],
      emailTae: [null, [Validators.required, Validators.email]],
      archivoDiagnostico: [null, [Validators.required]],
    });
    this.formEtap.disable();
    this.formAdulto = this._fb.group({
      tipoAdulto: [null, [Validators.required]],
      nombreCompleto: [null, [Validators.required]],
      telefono: [null, []],
      celular: [null, []],
      email: [null, [Validators.required, Validators.email]],
    });
  }
  agregarAdulto() {
    if (this.formAdulto.valid) {
      const adulto: IAdulto = { ...this.formAdulto.value, activo: true, index: this.adultos.length + 1 };
      this.adultos.push(adulto);
      this.formAdulto.reset();
    }
  }
  quitarAdulto(adulto: IAdulto) {
    const index = this.adultos.findIndex((x) => x.index === adulto.index);
    if (index !== -1) {
      this.adultos.splice(1, index);
    }
  }
  setDatosPersonalesTest() {
    this.formDatosPersonales.patchValue(this.alumnoData);
  }
  actualizarFormEtap() {
    if (this.seguimientoEtap) {
      this.formEtap.enable();
    } else {
      this.formEtap.disable();
    }
  }
  guardarAlumno() {
    console.log('this.formDatosPersonales.valid', this.formDatosPersonales.valid);
    console.log('this.formEtap.valid', this.formEtap.valid);
    if (this.formDatosPersonales.invalid) {
      Swal.fire({
        title: 'Oops! Datos incorrectos',
        text: 'El formulario de los datos personales no está completo. Verifique sus datos.',
        icon: 'error',
      });
      return;
    }
    if (this.seguimientoEtap && this.formEtap.invalid) {
      Swal.fire({
        title: 'Oops! Datos incorrectos',
        text: 'El formulario de seguimiento Etap no está completo. Verifique sus datos.',
        icon: 'error',
      });
      return;
    }
    if (!this.adultos || this.adultos.length < 1) {
      Swal.fire({
        title: 'Oops! Datos incorrectos',
        text: 'Para guardar un alumno debe agregar al menos un Padre o Madre o Tutor.',
        icon: 'error',
      });
      return;
    }

    const alumno: IAlumno = {
      ...this.formDatosPersonales.value,
      ...this.formEtap.value,
      adultos: this.adultos,
      telefono: this.formDatosPersonales.controls.telefono.value.toString(),
      celular: this.formDatosPersonales.controls.celular.value.toString(),
      seguimientoEtap: this.seguimientoEtap ? 'SI' : 'NO',
    };
    console.log('alumno', alumno);
    this.retDatosForm.emit(alumno);
  }
}
