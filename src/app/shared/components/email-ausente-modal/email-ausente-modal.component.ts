import { MediaMatcher, BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AlumnoService } from 'app/core/services/alumno.service';
import { IAlumno } from 'app/models/interface/iAlumno';
import { IAsistencia } from 'app/models/interface/iAsistencia';
import * as moment from 'moment';
import Swal from 'sweetalert2';
@UntilDestroy()
@Component({
  selector: 'app-email-ausente-modal',
  templateUrl: './email-ausente-modal.component.html',
  styleUrls: ['./email-ausente-modal.component.scss'],
})
export class EmailAusenteModalComponent implements OnInit {
  manual = false;
  form: FormGroup;
  cargando = false;
  alumno: IAlumno;
  asistencia: IAsistencia;
  faltas: number;
  // Mobile
  isMobile: boolean;
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _media: MediaMatcher,
    public breakpointObserver: BreakpointObserver,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<EmailAusenteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private _alumnoService: AlumnoService
  ) {
    this.mobileQuery = this._media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this._changeDetectorRef.detectChanges();
    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.HandsetPortrait]).subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
    this.alumno = data.alumno;
    this.asistencia = data.asistencia;
    this.faltas = data.faltas;
  }

  ngOnInit(): void {
    this.form = this._fb.group({
      adulto: [null, []],
      email: [null, [Validators.email]],
      observacion: [null, [Validators.minLength(7), Validators.maxLength(100)]],
    });
  }
  cerrar() {
    this.dialogRef.close();
  }
  enviar() {
    if (this.form.invalid) {
      Swal.fire({
        title: 'Formulario Incorrecto',
        text: 'Ingrese un email',
        icon: 'error',
      });
      return;
    }
    if (!this.form.controls.email.value && !this.form.controls.adulto) {
      Swal.fire({
        title: 'Formulario Incorrecto',
        text: 'Ingrese un email manualmente o seleccione uno de la lista',
        icon: 'error',
      });
      return;
    }
    const { adulto, observacion } = this.form.value;
    this.cargando = true;
    this._alumnoService
      .informarAusencia(
        adulto.nombreCompleto,
        moment.utc(this.asistencia.fecha).format('DD/MM/YYYY'),
        this.faltas,
        this.alumno.nombreCompleto,
        adulto.email,
        observacion ? observacion : ''
      )
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          Swal.fire({
            title: 'Email Enviado',
            text: 'El email fue enviado correctamente',
            icon: 'success',
          });
          this.cargando = false;
        },
        (error) => {
          Swal.fire({
            title: 'Error de envio',
            text: 'El email no pudo ser enviado, intentelo nuevamente.',
            icon: 'error',
          });
          console.log('[ERROR]', error);
          this.cargando = false;
        }
      );
  }
  toggleManual(evento) {
    this.manual = !this.manual;
  }
}
