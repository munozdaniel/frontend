import { Injectable } from '@angular/core';
import { DesignProgressBarService } from '@design/components/progress-bar/progress-bar.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AlumnoService } from '../alumno.service';
import { AsistenciaService } from '../asistencia.service';
import { CalificacionService } from '../calificacion.service';
import { TemaService } from '../tema.service';
import { AlumnosPorTallerPdf } from './alumnos-por-taller.pdf';
import { AlumnosPdf } from './alumnos.pdf';
import { CalificacionesDetalladoPdf } from './calificaciones-detallado.pdf';
import { CalificacionesResumidoPdf } from './calificaciones-resumido.pdf';
import { FichaAsistenciaDiaPdf } from './ficha-asistencias-dia.pdf';
import { FichaAsistenciaGeneralPdf } from './ficha-asistencias-general.pdf';
import { FichaAsistenciasPorDiaPdf } from './ficha-asistencias-por-dia.pdf';
import { FichaAsistenciasPorFechasPdf } from './ficha-asistencias-por-fechas.pdf';
import { LibroTemasPdf } from './libro-temas.pdf';
@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class ReportesService {
  planillaTaller: IPlanillaTaller;
  constructor(
    private _designProgressBarService: DesignProgressBarService,
    private _asistenciaService: AsistenciaService,
    private _alumnoService: AlumnoService,
    private _asistenciasPorDiaPdf: FichaAsistenciasPorDiaPdf,
    private _asistenciasPorFechasPdf: FichaAsistenciasPorFechasPdf,
    private _fichaAsistenciaGeneralPdf: FichaAsistenciaGeneralPdf,
    private _fichaAsistenciaDiaPdf: FichaAsistenciaDiaPdf,
    private _calificacioService: CalificacionService,
    private _calificacionesDetalladoPdf: CalificacionesDetalladoPdf,
    private _calificacionesResumidoPdf: CalificacionesResumidoPdf,
    private _temaService: TemaService,
    private _libroTemasPdf: LibroTemasPdf,
    private _alumnosPorTallerPdf: AlumnosPdf,
    private _alumnosPorTallerResumidoPdf: AlumnosPorTallerPdf
  ) {}
  setInformeDeAsistenciasPorFechas(asistenciasGrupo: any[], fechaInicio: string, fechaFinal = null) {
    this._designProgressBarService.show();
    Swal.fire({
      title: 'Generar Informe de Asistencias',
      html: 'El proceso puede tardar varios minutos debido a la cantidad de datos que se procesan. <br> <strong>¿Desea continuar?</strong>',
      icon: 'warning',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
    }).then((result: any) => {
      this._designProgressBarService.hide();
      if (result.isConfirmed) {
        this._asistenciasPorFechasPdf.generatePdf(asistenciasGrupo, fechaInicio, fechaFinal);
      }
    });
  }
  setInformeDeAsistenciasPorDia(asistencias: any[], fechaInicio: string) {
    this._designProgressBarService.show();
    Swal.fire({
      title: 'Generar Informe de Asistencias',
      html: 'El proceso puede tardar varios minutos debido a la cantidad de datos que se procesan. <br> <strong>¿Desea continuar?</strong>',
      icon: 'warning',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
    }).then((result: any) => {
      this._designProgressBarService.hide();
      if (result.isConfirmed) {
        this._asistenciasPorDiaPdf.generatePdf(asistencias, fechaInicio);
      }
    });
  }
  setInformeAsistenciasPorTaller() {
    this._designProgressBarService.show();
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
      this._designProgressBarService.hide();
      if (result.isConfirmed) {
        if (result.value) {
          if (!result.value.asistenciasPorAlumno || result.value.asistenciasPorAlumno.length < 1) {
            Swal.fire({
              title: 'Oops! Ocurrió un error',
              text: result.value.message,
              icon: 'error',
            });
            return;
          }
          //           asistenciasPorAlumno
          // calendario
          // alumnos
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
  setInformeAsistenciasPorDia() {
    this._designProgressBarService.show();
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
      this._designProgressBarService.hide();
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
          this._designProgressBarService.hide();
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
  setInformeCalificacionesPorTaller() {
    this._designProgressBarService.show();
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
      this._designProgressBarService.hide();
      if (result.isConfirmed) {
        if (result.value) {
          if (!result.value.calificaciones || result.value.calificaciones.length < 1) {
            Swal.fire({
              title: 'Informe cancelado',
              text: 'NO hay registros cargados',
              icon: 'error',
            });
            return;
          }
          this._designProgressBarService.hide();
          this._designProgressBarService.hide();
          this._calificacionesDetalladoPdf.generatePdf(this.planillaTaller, result.value.calificaciones);
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
  setInformeCalificacionesPorTallerResumido() {
    this._designProgressBarService.show();
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
          // return this._calificacioService.informeCalificacionesPorPlanilla(this.planillaTaller).pipe(
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
      this._designProgressBarService.hide();
      if (result.isConfirmed) {
        if (result.value) {
          //   if (!result.value.calificacionesPorAlumno || result.value.calificacionesPorAlumno.length < 1) {
          if (!result.value.reporteAlumnos || result.value.reporteAlumnos.length < 1) {
            Swal.fire({
              title: 'Informe cancelado',
              text: 'NO hay registros cargados',
              icon: 'error',
            });
            return;
          }
          this._designProgressBarService.hide();
          this._designProgressBarService.hide();
          //   this._calificacionesResumidoPdf.generatePdf(this.planillaTaller, result.value.calificacionesPorAlumno);
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
  setSeguimientoPorTaller() {
    alert('TRABAJO EN PROGRESO... NO USAR');
  }
  setInformeLibroDeTemas() {
    this._designProgressBarService.show();
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
      this._designProgressBarService.hide();
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
          this._designProgressBarService.hide();
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
  setInformeTallerPorAlumnos() {
    this._designProgressBarService.show();
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
      this._designProgressBarService.hide();
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
  setInformeAlumnosPorTaller() {
    this._designProgressBarService.show();
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
      this._designProgressBarService.hide();
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
