import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DesignProgressBarService } from '@design/components/progress-bar/progress-bar.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AlumnoService } from 'app/core/services/alumno.service';
import { AsistenciaService } from 'app/core/services/asistencia.service';
import { CalificacionService } from 'app/core/services/calificacion.service';
import { AlumnosPorTallerPdf } from 'app/core/services/pdf/alumnos-por-taller.pdf';
import { AlumnosPdf } from 'app/core/services/pdf/alumnos.pdf';
import { CalificacionesDetalladoPdf } from 'app/core/services/pdf/calificaciones-detallado.pdf';
import { CalificacionesResumidoPdf } from 'app/core/services/pdf/calificaciones-resumido.pdf';
import { FichaAsistenciaDiaPdf } from 'app/core/services/pdf/ficha-asistencias-dia.pdf';
import { FichaAsistenciaGeneralPdf } from 'app/core/services/pdf/ficha-asistencias-general.pdf';
import { LibroTemasPdf } from 'app/core/services/pdf/libro-temas.pdf';
import { TemaService } from 'app/core/services/tema.service';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
@UntilDestroy()
@Component({
  selector: 'app-informes',
  template: `
    <app-planilla-detalle-informes
      [cargando]="cargando"
      (retInformeAsistenciaPorTaller)="setInformeAsistenciaPorTaller($event)"
      (retInformeAsistenciaPorDia)="setInformeAsistenciaPorDia($event)"
      (retInformeCalificacionesPorTaller)="setInformeCalificacionesPorTaller($event)"
      (retInformeCalificacionesResumido)="setInformeCalificacionesResumido($event)"
      (retSeguimientoPorTaller)="setSeguimientoPorTaller($event)"
      (retInformeLibroDeTemas)="setInformeLibroDeTemas($event)"
      (retInformeResumenTallerPorAlumnos)="setInformeResumenTallerPorAlumnos($event)"
      (retInformeListadoAlumnosTaller)="setInformeListadoAlumnosTaller($event)"
    >
    </app-planilla-detalle-informes>
  `,
  styles: [],
})
export class InformesComponent implements OnInit, OnChanges {
  @Input() planillaTaller: IPlanillaTaller;
  cargando = false;
  constructor(
    private _designProgressBarService: DesignProgressBarService,
    private _asistenciaService: AsistenciaService,
    private _alumnoService: AlumnoService,
    //
    private _fichaAsistenciaGeneralPdf: FichaAsistenciaGeneralPdf,
    private _fichaAsistenciaDiaPdf: FichaAsistenciaDiaPdf,
    //
    private _calificacioService: CalificacionService,
    private _calificacionesDetalladoPdf: CalificacionesDetalladoPdf,
    private _calificacionesResumidoPdf: CalificacionesResumidoPdf,
    //
    private _temaService: TemaService,
    private _libroTemasPdf: LibroTemasPdf,
    //
    private _alumnosPorTallerPdf: AlumnosPdf,
    private _alumnosPorTallerResumidoPdf: AlumnosPorTallerPdf
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.planillaTaller && changes.planillaTaller.currentValue) {
      console.log('this.planillaTaller', this.planillaTaller);
    }
  }

  ngOnInit(): void {}
  //   GENERAL
  setInformeAsistenciaPorTaller(evento) {
    // FIXME:
    this.cargando = true;
    // this._designProgressBarService.show();

    Swal.fire({
      title: 'Generar Informe',
      html: 'El proceso puede tardar varios minutos debido a la cantidad de datos que se procesan. <br> <strong>¿Desea continuar?</strong>',
      icon: 'warning',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this._asistenciaService.informeAsistenciasPlantillasEntreFechas(this.planillaTaller).pipe(
          catchError((error) => {
            console.log('[ERROR]', error);
            Swal.fire({
              title: 'Oops! Ocurrió un error',
              text: error && error.error ? error.error.message : 'Error de conexion',
              icon: 'error',
            });
            return of(error);
          }),
          untilDestroyed(this)
        );
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result: any) => {
      this.cargando = false;
      if (result.isConfirmed) {
        if (result.value) {
          if (!result.value.asistenciasPorAlumno || result.value.asistenciasPorAlumno.length < 1) {
            Swal.fire({
              title: 'Informe cancelado',
              text: 'NO hay registros cargados',
              icon: 'error',
            });
            return;
          }
          this.cargando = false;
          this._designProgressBarService.hide();
          this._fichaAsistenciaGeneralPdf.generatePdf(this.planillaTaller, result.value.asistenciasPorAlumno);
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
  //   POR DIA
  setInformeAsistenciaPorDia(evento) {
    this.cargando = true;
    // this._designProgressBarService.show();

    Swal.fire({
      title: 'Generar Informe',
      html: 'El proceso puede tardar varios minutos debido a la cantidad de datos que se procesan. <br> <strong>¿Desea continuar?</strong>',
      icon: 'warning',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this._asistenciaService.informeAsistenciasPorPlanilla(this.planillaTaller).pipe(
          catchError((error) => {
            console.log('[ERROR]', error);
            Swal.fire({
              title: 'Oops! Ocurrió un error',
              text: error && error.error ? error.error.message : 'Error de conexion',
              icon: 'error',
            });
            return of(error);
          }),
          untilDestroyed(this)
        );
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result: any) => {
      this.cargando = false;
      if (result.isConfirmed) {
        if (result.value) {
          if (!result.value.asistenciasPorAlumno || result.value.asistenciasPorAlumno.length < 1) {
            Swal.fire({
              title: 'Informe cancelado',
              text: 'NO hay registros cargados',
              icon: 'error',
            });
            return;
          }
          this.cargando = false;
          this._designProgressBarService.hide();
          this._fichaAsistenciaDiaPdf.generatePdf(this.planillaTaller, result.value.asistenciasPorAlumno);
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
  setInformeCalificacionesPorTaller(evento) {
    this.cargando = true;
    // this._designProgressBarService.show();

    Swal.fire({
      title: 'Generar Informe',
      html: 'El proceso puede tardar varios minutos debido a la cantidad de datos que se procesan. <br> <strong>¿Desea continuar?</strong>',
      icon: 'warning',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this._calificacioService.informeCalificacionesPorPlanilla(this.planillaTaller).pipe(
          catchError((error) => {
            console.log('[ERROR]', error);
            Swal.fire({
              title: 'Oops! Ocurrió un error',
              text: error && error.error ? error.error.message : 'Error de conexion',
              icon: 'error',
            });
            return of(error);
          }),
          untilDestroyed(this)
        );
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result: any) => {
      this.cargando = false;
      if (result.isConfirmed) {
        if (result.value) {
          if (!result.value.calificacionesPorAlumno || result.value.calificacionesPorAlumno.length < 1) {
            Swal.fire({
              title: 'Informe cancelado',
              text: 'NO hay registros cargados',
              icon: 'error',
            });
            return;
          }
          this.cargando = false;
          this._designProgressBarService.hide();
          this._calificacionesDetalladoPdf.generatePdf(this.planillaTaller, result.value.calificacionesPorAlumno);
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
  setInformeCalificacionesResumido(evento) {
    this.cargando = true;
    // this._designProgressBarService.show();

    Swal.fire({
      title: 'Generar Informe',
      html: 'El proceso puede tardar varios minutos debido a la cantidad de datos que se procesan. <br> <strong>¿Desea continuar?</strong>',
      icon: 'warning',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this._calificacioService.informeCalificacionesPorPlanilla(this.planillaTaller).pipe(
          catchError((error) => {
            console.log('[ERROR]', error);
            Swal.fire({
              title: 'Oops! Ocurrió un error',
              text: error && error.error ? error.error.message : 'Error de conexion',
              icon: 'error',
            });
            return of(error);
          }),
          untilDestroyed(this)
        );
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result: any) => {
      this.cargando = false;
      if (result.isConfirmed) {
        if (result.value) {
          if (!result.value.calificacionesPorAlumno || result.value.calificacionesPorAlumno.length < 1) {
            Swal.fire({
              title: 'Informe cancelado',
              text: 'NO hay registros cargados',
              icon: 'error',
            });
            return;
          }
          this.cargando = false;
          this._designProgressBarService.hide();
          this._calificacionesResumidoPdf.generatePdf(this.planillaTaller, result.value.calificacionesPorAlumno);
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
  setSeguimientoPorTaller(evento) {
    alert('TRABAJO EN PROGRESO... NO USAR');
  }
  setInformeLibroDeTemas(evento) {
    this.cargando = true;
    // this._designProgressBarService.show();

    Swal.fire({
      title: 'Generar Informe',
      html: 'El proceso puede tardar varios minutos debido a la cantidad de datos que se procesan. <br> <strong>¿Desea continuar?</strong>',
      icon: 'warning',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this._temaService.informeTemasPorPlanillaTaller(this.planillaTaller).pipe(
          catchError((error) => {
            console.log('[ERROR]', error);
            Swal.fire({
              title: 'Oops! Ocurrió un error',
              text: error && error.error ? error.error.message : 'Error de conexion',
              icon: 'error',
            });
            return of(error);
          }),
          untilDestroyed(this)
        );
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result: any) => {
      this.cargando = false;
      if (result.isConfirmed) {
        if (result.value) {
          if (!result.value.temasPorFecha || result.value.temasPorFecha.length < 1) {
            Swal.fire({
              title: 'Informe cancelado',
              text: 'NO hay registros cargados',
              icon: 'error',
            });
            return;
          }
          this.cargando = false;
          this._designProgressBarService.hide();
          this._libroTemasPdf.generatePdf(this.planillaTaller, result.value.temasPorFecha);
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
  setInformeResumenTallerPorAlumnos(evento) {
    this.cargando = true;
    // this._designProgressBarService.show();

    Swal.fire({
      title: 'Generar Informe',
      html: 'El proceso puede tardar varios minutos debido a la cantidad de datos que se procesan. <br> <strong>¿Desea continuar?</strong>',
      icon: 'warning',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this._calificacioService.informeAlumnosPorTaller(this.planillaTaller).pipe(
          catchError((error) => {
            console.log('[ERROR]', error);
            Swal.fire({
              title: 'Oops! Ocurrió un error',
              text: error && error.error ? error.error.message : 'Error de conexion',
              icon: 'error',
            });
            return of(error);
          }),
          untilDestroyed(this)
        );
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result: any) => {
      this.cargando = false;
      if (result.isConfirmed) {
        if (result.value) {
          if (!result.value.reporteAlumnos || result.value.reporteAlumnos.length < 1) {
            Swal.fire({
              title: 'Informe cancelado',
              text: 'NO hay registros cargados',
              icon: 'error',
            });
            return;
          }
          this._designProgressBarService.hide();
          this._alumnosPorTallerResumidoPdf.generatePdf(this.planillaTaller, result.value.reporteAlumnos);
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
  setInformeListadoAlumnosTaller(evento) {
    this.cargando = true;
    // this._designProgressBarService.show();

    Swal.fire({
      title: 'Generar Informe',
      html: 'El proceso puede tardar varios minutos debido a la cantidad de datos que se procesan. <br> <strong>¿Desea continuar?</strong>',
      icon: 'warning',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this._alumnoService.informeAlumnosPorPlanilla(this.planillaTaller).pipe(
          catchError((error) => {
            console.log('[ERROR]', error);
            Swal.fire({
              title: 'Oops! Ocurrió un error',
              text: error && error.error ? error.error.message : 'Error de conexion',
              icon: 'error',
            });
            return of(error);
          }),
          untilDestroyed(this)
        );
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result: any) => {
      this.cargando = false;
      if (result.isConfirmed) {
        if (result.value) {
          if (!result.value.alumnos || result.value.alumnos.length < 1) {
            Swal.fire({
              title: 'Informe cancelado',
              text: 'NO hay registros cargados',
              icon: 'error',
            });
            return;
          }
          this._designProgressBarService.hide();
          this._alumnosPorTallerPdf.generatePdf(this.planillaTaller, result.value.alumnos);
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
