import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { NACIONALIDADES } from 'app/models/constants/nacionalidad';
import { ALUMNO_DATA } from 'app/models/data/alumnoData';
import { IAdulto } from 'app/models/interface/iAdulto';
import { IAlumno } from 'app/models/interface/iAlumno';
import { IEstadoCursada } from 'app/models/interface/iEstadoCursada';
import { CursadaFormComponent } from 'app/shared/components/cursada-form/cursada-form.component';
import { CONFIG_PROVIDER } from 'app/shared/config.provider';
import { environment } from 'environments/environment';
import * as moment from 'moment';
import { FileUploader } from 'ng2-file-upload';
import Swal from 'sweetalert2';
import { AdultosFormComponent } from '../adultos-form/adultos-form.component';
const URL = 'http://localhost:8081/api/upload';

@Component({
  selector: 'app-alumnos-form',
  templateUrl: './alumnos-form.component.html',
  styleUrls: ['./alumnos-form.component.scss'],
  providers: CONFIG_PROVIDER, // Para el time
})
export class AlumnosFormComponent implements OnInit, OnChanges {
  protected url = environment.apiURI;
  protected apiUpload = environment.apiUpload;

  public uploader: FileUploader;
  @Input() soloLectura?: boolean = false;
  @Input() titulo: string;
  @Input() alumno: IAlumno;
  @Input() cargando: boolean;
  @Input() resetear: boolean;
  @Input() estadoCursadaEditada: IEstadoCursada;
  @Output() retDatosForm = new EventEmitter<IAlumno>();

  //   @Output() retEditarEstadoCursada = new EventEmitter<IEstadoCursada>();
  @Output() retAgregarCursada = new EventEmitter<IEstadoCursada>();
  @Output() retActualizarEstadoCursadas = new EventEmitter<IEstadoCursada[]>();
  //
  formDatosPersonales: FormGroup;
  formEtap: FormGroup;
  nacionalidades = NACIONALIDADES;

  adultos: IAdulto[] = [];
  estadoCursadas: IEstadoCursada[] = [];
  alumnoData = ALUMNO_DATA;
  seguimientoEtap = false;
  constructor(private _fb: FormBuilder, private _dialog: MatDialog) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.estadoCursadaEditada && changes.estadoCursadaEditada.currentValue) {
      const index = this.estadoCursadas.findIndex((x) => x.index === this.estadoCursadaEditada.index);
      if (index !== -1) {
        this.estadoCursadas[index] = this.estadoCursadaEditada;
        this.estadoCursadas = [...this.estadoCursadas];
      }
    }
    if (changes.resetear && changes.resetear.currentValue === true) {
      this.formDatosPersonales.reset();
      this.adultos = [];
      this.formEtap.reset();
    }
    if (changes.alumno && changes.alumno.currentValue) {
      if (!this.uploader) {
        this.uploader = new FileUploader({
          url: this.url + `alumnos/upload-diagnostico/${this.alumno._id}`,
          itemAlias: 'diagnostico',
        });
        this.uploader.onSuccessItem = (file, response) => {
          let data = JSON.parse(response); //success server response
          this.alumno.archivoDiagnostico = data.data.archivoDiagnostico;
        };
        this.uploader.onAfterAddingFile = (file) => {
          file.withCredentials = false;
          //   console.log('onAfterAddingFile File onAfterAddingFile:', file);
        };
        this.uploader.onCompleteItem = (item: any, status: any) => {
          //   console.log('Uploaded File Details:', item);
          Swal.fire({
            title: 'Archivo guardado',
            text: 'El diagnostico digital ha sido guardado correctamente',
            icon: 'success',
            timer: 2000,
            timerProgressBar: true,
          }).then(() => {});
        };
      }
      this.setFormularios();
    }
  }

  ngOnInit(): void {
    this.formDatosPersonales = this._fb.group({
      tipoDni: [null, []],
      legajo: [null, []],
      dni: [null, [Validators.required, Validators.minLength(7), Validators.maxLength(9)]],
      nombreCompleto: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],
      sexo: [null, [Validators.minLength(4), Validators.maxLength(9)]],
      fechaNacimiento: [null, []],
      nacionalidad: [null, []],
      observacionTelefono: [null, [Validators.minLength(3), Validators.maxLength(50)]],
      telefono: [null, [Validators.minLength(7), Validators.maxLength(20)]],
      celular: [null, [Validators.minLength(7), Validators.maxLength(20)]],
      email: [null, [Validators.email, Validators.minLength(4), Validators.maxLength(50)]],

      fechaIngreso: [null, []],
      procedenciaColegioPrimario: [null, [Validators.minLength(4), Validators.maxLength(50)]],
      procedenciaColegioSecundario: [null, [Validators.minLength(4), Validators.maxLength(50)]],
      fechaDeBaja: [null, []],
      motivoDeBaja: [null, [Validators.maxLength(255)]],
      domicilio: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      cantidadIntegranteGrupoFamiliar: [null, []],

      observacion: [null, [Validators.minLength(4), Validators.maxLength(100)]],
      activo: [true],
    });
    this.formEtap = this._fb.group({
      nombreCompletoTae: [null, [Validators.required]],
      emailTae: [null, [Validators.required, Validators.email]],
      diagnostico: [null, []],
      archivoDiagnostico: [[]],
    });
    this.formEtap.disable();
    if (!environment.production) {
      const a = {
        tipoDni: 'DNI',
        legajo: '12345',
        dni: 3333333,
        nombreCompleto: 'Preuba Email',
        sexo: 'MASCULINO',
        domicilio: 'Una calle',
      };
      this.formDatosPersonales.patchValue(a);
    }
  }
  setFormularios() {
    if (!this.formDatosPersonales && !this.formEtap) {
      setTimeout(() => {
        this.setFormularios();
      }, 1000);
      return;
    }
    this.estadoCursadas = this.alumno.estadoCursadas;
    this.formDatosPersonales.patchValue(this.alumno);
    if (this.alumno.fechaIngreso !== 'Sin Registrar' && moment.utc(this.alumno.fechaIngreso).isValid()) {
      this.formDatosPersonales.controls.fechaIngreso.setValue(moment.utc(this.alumno.fechaIngreso));
    }
    if (this.alumno.fechaNacimiento && this.alumno.fechaNacimiento !== 'Invalid date') {
      this.formDatosPersonales.controls.fechaNacimiento.setValue(moment.utc(this.alumno.fechaNacimiento));
    }
    if (this.alumno.seguimientoEtap === 'SI') {
      this.formEtap.patchValue(this.alumno);
    } else {
      this.formEtap.get('nombreCompletoTae').clearValidators();
      this.formEtap.get('emailTae').clearValidators();
      this.formEtap.get('nombreCompletoTae').updateValueAndValidity();
      this.formEtap.get('emailTae').updateValueAndValidity();
    }
    this.adultos = this.alumno.adultos.map((x: IAdulto, index: number) => ({ ...x, index: index + 1 }));
    this.seguimientoEtap = this.alumno.seguimientoEtap && this.alumno.seguimientoEtap === 'SI' ? true : false;
    this.formDatosPersonales.controls.sexo.setValue(this.alumno.sexo.toUpperCase());
    this.formDatosPersonales.controls.tipoDni.setValue(this.alumno.tipoDni ? this.alumno.tipoDni.toUpperCase() : 'DNI');
    if (!this.soloLectura) {
      this.actualizarFormEtap();
    } else {
      this.formDatosPersonales.disable();
      this.formEtap.disable();
    }
  }
  abrirModalAdulto() {
    const dialogRef = this._dialog.open(AdultosFormComponent, {
      data: { esModal: true },
      width: '50%',
    });

    dialogRef.afterClosed().subscribe((adulto: IAdulto) => {
      if (adulto) {
        adulto.index = Math.random();
        this.adultos = [...this.adultos, adulto];
      }
    });
  }
  setEliminarAdulto(adulto: IAdulto) {
    const index = this.adultos.findIndex((x) => x.index === adulto.index);
    if (index !== -1) {
      this.adultos.splice(index, 1);
    }
  }
  setEditarNotificarAdulto(adulto: IAdulto) {
    const index = this.adultos.findIndex((x) => x.index === adulto.index);
    if (index !== -1) {
      this.adultos[index] = adulto;
    }
  }
  setEditarAdulto(adulto: IAdulto) {
    const index = this.adultos.findIndex((x) => x.index === adulto.index);
    if (index !== -1) {
      const dialogRef = this._dialog.open(AdultosFormComponent, {
        data: { esModal: true, adulto: this.adultos[index] },
        width: '50%',
      });

      dialogRef.afterClosed().subscribe((adulto: IAdulto) => {
        if (adulto) {
          // adulto.index = Math.random();
          this.adultos[index] = adulto;
          // this.adultos = [...this.adultos, adulto];
        }
      });
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
      //   ...this.formEtap.value,
      adultos: this.adultos,
      estadoCursadas: this.estadoCursadas,
      telefono: this.formDatosPersonales.controls.telefono.value ? this.formDatosPersonales.controls.telefono.value.toString() : null,
      celular: this.formDatosPersonales.controls.celular.value ? this.formDatosPersonales.controls.celular.value.toString() : null,
      seguimientoEtap: this.seguimientoEtap ? 'SI' : 'NO',
      nombreCompletoTae: this.seguimientoEtap ? this.formEtap.controls.nombreCompletoTae.value : null,
      emailTae: this.seguimientoEtap ? this.formEtap.controls.emailTae.value : null,
      diagnostico: this.seguimientoEtap ? this.formEtap.controls.diagnostico.value : null,
      archivoDiagnostico: this.seguimientoEtap ? this.formEtap.controls.archivoDiagnostico.value : null,
    };
    this.retDatosForm.emit(alumno);
  }
  abrirModalComision() {
    const dialogRef = this._dialog.open(CursadaFormComponent, {
      data: { esModal: true },
      width: '50%',
    });

    dialogRef.afterClosed().subscribe((estadoCursada: IEstadoCursada) => {
      if (estadoCursada) {
        console.log('estadoCursadsssa', estadoCursada);
        this.estadoCursadas = [...this.estadoCursadas, estadoCursada];
        this.estadoCursadas.forEach((x: any, index) => {
          x.index = index;
        });
        this.retAgregarCursada.emit(estadoCursada);
        // estadoCursada.index = Math.random();
        // this.estadoCursadas = [...this.estadoCursadas, estadoCursada];
      }
    });
  }

  setEliminarComision(evento: IEstadoCursada) {
    console.log('setEliminarComision', evento);
    if (evento) {
      const index = this.estadoCursadas.findIndex((x) => x.index === evento.index);
      if (index !== -1) {
        this.estadoCursadas.splice(index, 1);
        this.estadoCursadas = [...this.estadoCursadas];
        this.retActualizarEstadoCursadas.emit(this.estadoCursadas);
      }
    }
  }
  setEditarComision(evento: IEstadoCursada) {
    if (evento) {
      // Controlar que el estado de cursada no esté asigando en alumnos

      const dialogRef = this._dialog.open(CursadaFormComponent, {
        data: { esModal: true, estadoCursada: evento },
        width: '50%',
      });

      dialogRef.afterClosed().subscribe((estadoCursada: IEstadoCursada) => {
        if (estadoCursada) {
          //   this.retEditarEstadoCursada.emit(estadoCursada);
          const index = this.estadoCursadas.findIndex((x) => x._id === evento._id);
          if (index !== -1) {
            this.estadoCursadas[index] = estadoCursada;
            this.estadoCursadas = [...this.estadoCursadas];
            this.retActualizarEstadoCursadas.emit(this.estadoCursadas);
          }
        }
      });
    }
  }
}
