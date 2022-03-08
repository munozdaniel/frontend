import { Component, OnInit } from '@angular/core';
import { designAnimations } from '@design/animations';
import { ExcelService } from 'app/core/services/excel/excel.service';
import { IAlumno } from 'app/models/interface/iAlumno';
import * as _ from 'lodash';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { forkJoin, of, from } from 'rxjs';
import { catchError, map, mergeMap, tap, toArray } from 'rxjs/operators';
import { AlumnoService } from 'app/core/services/alumno.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from 'app/core/services/general/validation.services';
import * as moment from 'moment';
import { Router } from '@angular/router';
@UntilDestroy()
@Component({
  selector: 'app-importar-alumnos',
  template: `
    <button-volver></button-volver>
    <div fxLayout="column" class="w-100-p p-24 mt-50" fxLayoutGap="20px">
      <div fxLayout="column" class="mat-card mat-elevation-z4 p-24">
        <div fxLayout="row wrap" fxLayoutAlign="space-between center" class="w-100-p mb-12" style="border-bottom: 2px solid #80808057;">
          <div>
            <h1 [@animate]="{ value: '*', params: { x: '50px' } }" class="px-12">{{ titulo }}</h1>
            <mat-spinner *ngIf="cargando" matSuffix class="ml-10" diameter="20"></mat-spinner>
          </div>
          <button mat-raised-button color="accent" fxFlex.xs="100" (click)="setExcelEjemplo()">Excel Ejemplo</button>
        </div>
        <div class="message-box danger">
          <span> Versión no disponible para dispositivos móviles </span>
        </div>
      </div>

      <div class="message-box warning">
        <span>
          Antes de importar los alumnos verifique que el archivo excel tenga el formato requerido<strong> (Ver Excel de Ejemplo)</strong>
        </span>
      </div>
      <div class="message-box info">
        <span
          >Para guardar el estado de la cursada del alumno los datos obligatorios son:
          <strong>Ciclo Lectivo, Division y Curso</strong>.</span
        >
        <br />
        <span>Si no se ingresa la condición de la cursada por defecto el alumno se seteará en <strong>'REGULAR'</strong></span>
      </div>
      <div fxLayout="row wrap" fxLayoutAlign="center start">
        <app-alumnos-file
          fxFlex="100"
          [formulario]="formulario"
          [alumnos]="alumnos"
          [cargando]="cargando"
          (retArchivo)="setArchivo($event)"
          (retExcelEjemplo)="setExcelEjemplo($event)"
          (retSeleccion)="setSeleccion($event)"
          (retUsuariosFallados)="setUsuariosFallados($event)"
        ></app-alumnos-file>
        <!-- <div fxFlex="100" fxLayout="row" fxLayoutAlign="center start" class="mt-24">
          <button mat-raised-button color="primary" (click)="guardar()">GUARDAR ALUMNOS</button>
        </div> -->
      </div>
    </div>
  `,
  styles: [],
  animations: designAnimations,
})
export class ImportarAlumnosComponent implements OnInit {
  formulario: FormGroup;
  alumnos: IAlumno[];
  alumnosGuardados: IAlumno[];
  cargando = false;
  titulo = 'Importar Alumnos';
  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _excelService: ExcelService,
    private _alumnoService: AlumnoService
  ) {}

  ngOnInit(): void {
    this.formulario = this._fb.group({
      alumnos: [[], [Validators.required, ValidationService.alMenosUnItemEnElArreglo]],
    });
  }
  setArchivo(evento) {
    if (evento) {
      const target: DataTransfer = evento.target;
      if (target.files.length !== 1) {
        throw new Error('Imposible subir multiples archivos');
      }
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        const usuarioArchivo = XLSX.utils.sheet_to_json(ws, { header: 0, defval: '', raw: false });
        this.validacionesDeCampo(usuarioArchivo);
        //  this._usuarios$.next(usuarioArchivo);
      };

      reader.readAsBinaryString(target.files[0]);
    }
  }
  validacionesDeCampo(alumnosArchivo) {
    this.cargando = true;
    const u = alumnosArchivo.map((x) => {
      const descripcionError = [];
      let doc = null;
      let tipoDoc = null;
      let tieneError = false;
      //   const regexEmail = new RegExp(/(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@[*[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+]*/);
      //   if (!regexEmail.test(x.email)) {
      //     tieneError = true;
      //     descripcionError.push('Email Inválido');
      //   }
      //   if (!x.legajo || x.legajo.toString().trim() === '') {
      //     tieneError = true;
      //     descripcionError.push('El legajo es requerido');
      //   }
      if (x['FECHA NACIMIENTO']) {
        const f = moment(x['FECHA NACIMIENTO']);
        if (!f.isValid()) {
          x['FECHA NACIMIENTO'] = null;
        }
      }
      if (!x['APELLIDO Y NOMBRES'] || x['APELLIDO Y NOMBRES'].toString().trim() === '') {
        tieneError = true;
        descripcionError.push('El nombre y el apellido son requeridos');
      }
      if (!x.DOCUMENTO || x.DOCUMENTO.toString().trim() === '') {
        tieneError = true;
        descripcionError.push('El documento y tipo de documento es requerido');
        //   } else {
        // const documento = x.DOCUMENTO.split('-');
        // if (documento.length !== 2) {
        //   tieneError = true;
        //   descripcionError.push('El documento y tipo de documento no tiene el formato adecuado: Ej: DNI - 12345678 ');
        // }
        // tipoDoc = documento[0].trim();
        // doc = documento[1].trim();
      }
      //   console.log('1.', x['FECHA NACIMIENTO']);
      //   console.log('2.', moment(x['FECHA NACIMIENTO'], 'dmmmyy').format('YYYY-MM-DD'));
      //   console.log('3.', moment(x['FECHA NACIMIENTO'], 'DD/MM/YYYY'));
      const row: any = {
        turno: x.TURNO,
        curso: x.CURSO,
        division: x.DIVISION,
        comision: x.COMISION,
        condicion: x.CONDICION ? x.CONDICION : 'REGULAR',
        cicloLectivo: x['CICLO LECTIVO'],
        dni: x.DOCUMENTO,
        nombreCompleto: x['APELLIDO Y NOMBRES'].toUpperCase(),
        fechaNacimiento: x['FECHA NACIMIENTO'] ? moment(x['FECHA NACIMIENTO']).utc().format('YYYY-MM-DD') : null,
        // 'LUGAR DE NACIMIENTO': x['LUGAR DE NACIMIENTO'],
        // 'ES REPITENTE': x['ES REPITENTE'],
        telefono: x.TELEFONO,
        celular: x['TELEFONO DE URGENCIA'],
        domicilio: x.DOMICILIO,
        // LOCALIDAD: x.LOCALIDAD,

        // legajo: x.legajo, // Usar 1 solo
        // nombreCompleto: _.capitalize(x.nombreCompleto),
        // tipoDni: tipoDoc,
        // dni: doc,
        tieneError,
        descripcionError: descripcionError.join(' - '),
        selected: !tieneError,
        // nacionalidad: 'SIN REGISTRAR',
        // domicilio: 'SIN REGISTRAR',
        cantidadIntegranteGrupoFamiliar: 0,
        incompleto: true,
      };
      return row;
    });
    // " ": 304470
    // " _1": "CE"
    // " _2": "R"
    // " _3": ""
    // " _4": ""
    // " _5": ""
    // " _6": ""
    // " _7": ""
    // Apellido y Nombres: "ACATAPPA Marcelo Tomás"
    // Documento: "DNI - 47283150"
    // Estado: ""
    this.validacionesAsincronicas(u);
  }
  capitalizeTheFirstLetterOfEachWord(words) {
    var separateWord = words.toLowerCase().split(' ');
    for (var i = 0; i < separateWord.length; i++) {
      separateWord[i] = separateWord[i].charAt(0).toUpperCase() + separateWord[i].substring(1).toLowerCase();
    }
    return separateWord.join(' ');
  }
  validacionesAsincronicas(usuariosFiltrados: any[]) {
    from(usuariosFiltrados)
      .pipe(
        toArray(),
        mergeMap((datos: any) => {
          const observables = datos.map((x) => {
            if (x.dni && x.dni !== '') {
              return this._alumnoService.disponibleDni(x.dni).pipe(
                map((i) => {
                  if (typeof i === 'boolean' && i === true) {
                    return { ...x, dniDisponible: true };
                  } else {
                    console.log('El dni ya se encuentra en uso');
                    const mensaje = 'El dni ya se encuentra en uso';
                    return {
                      ...x,
                      dniDisponible: false,
                      tieneError: true,
                      checked: false,
                      selected: false,
                      descripcionError: x.descripcionError !== '' ? x.descripcionError + ' - ' + mensaje : mensaje,
                    };
                  }
                })
              );
            } else {
              return of({ ...x, dniDisponible: false }); // Se analiza en el paso anterior
            }
          });

          return forkJoin(observables);
        }),

        untilDestroyed(this)
      )
      .subscribe(
        (datos: any) => {
          this.alumnos = [...datos];
          this.cargando = false;
        },
        (error) => {
          console.log('[ERROR]', error);
          this.cargando = false;
        }
      );
  }
  setExcelEjemplo(evento?) {
    const ejemplo = [
      {
        TURNO: 'TARDE',
        CURSO: 1,
        DIVISION: 1,
        COMISION: 'A',
        'CICLO LECTIVO': 2021,
        CONDICION: 'REGULAR',
        DOCUMENTO: 12345678, // TIPODNI - NUMERO (este formato si o si con "-")
        'APELLIDO Y NOMBRES': 'PRUEBA JAVIER BENJAMIN',
        'FECHA NACIMIENTO': '31/12/2007',
        'LUGAR DE NACIMIENTO': 'No se usa',
        'ES REPITENTE': 'No se usa',
        TELEFONO: '111111111',
        'TELEFONO DE URGENCIA': '222222222',
        DOMICILIO: 'CAPITAN GOMEZ 1578',
        LOCALIDAD: 'CIPOLLETTI',
      },
    ];

    this._excelService.exportAsExcelFile(ejemplo, 'Plantilla de alumnos - Ejemplo');
  }
  setSeleccion(evento) {
    this.alumnos = [...evento];
    this.guardar();
  }
  setUsuariosFallados(evento: IAlumno[]) {
    if (evento) {
      //   console.log('ALUMNOS FALLADOS', evento);
    }
  }
  guardar() {
    const alumnosCheck = this.alumnos.filter((x) => x.selected);
    Swal.fire({
      title: '¿Está seguro de continuar?',
      html: 'Está a punto de <strong>GUARDAR</strong> ' + alumnosCheck.length + ' alumnos',
      icon: 'warning',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this._alumnoService.guardarMasivo(alumnosCheck).pipe(
          catchError((error) => {
            console.log('[ERROR]', error);
            Swal.fire({
              title: 'Oops! Ocurrió un error',
              text: error && error.error ? error.error.message : 'Error de conexion',
              icon: 'error',
            });
            return of(error);
          })
        );
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result: any) => {
      if (result.isConfirmed) {
        if (result.value && result.value.status === 200) {
          this.alumnosGuardados = result.value.alumnos;

          Swal.fire({
            title: 'Operación Exitosa',
            text: 'Los alumnos se han guardado correctamente correctamente.',
            icon: 'success',
            timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            this._router.navigate(['/parametrizar/alumnos']);
          });
        } else {
          Swal.fire({
            title: 'Oops! Ocurrió un error',
            text: 'Intentelo nuevamente. Si el problema persiste comuniquese con el soporte técnico.',
            icon: 'error',
          });
        }
      }
    });
  }
}
