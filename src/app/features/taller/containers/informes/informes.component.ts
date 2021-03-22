import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DesignProgressBarService } from '@design/components/progress-bar/progress-bar.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AlumnoService } from 'app/core/services/alumno.service';
import { AsistenciaService } from 'app/core/services/asistencia.service';
import { FichaAsistenciaDiaPdf } from 'app/core/services/pdf/ficha-asistencias-dia.pdf';
import { FichaAsistenciaGeneralPdf } from 'app/core/services/pdf/ficha-asistencias-general.pdf';
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
    private _fichaAsistenciaGeneralPdf: FichaAsistenciaGeneralPdf,
    private _fichaAsistenciaDiaPdf: FichaAsistenciaDiaPdf
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.planillaTaller && changes.planillaTaller.currentValue) {
      console.log('this.planillaTaller', this.planillaTaller);
    }
  }

  ngOnInit(): void {}
  setInformeAsistenciaPorTaller(evento) {
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
      console.log('result,', result);
      if (result.isConfirmed) {
        if (result.value) {
          if (!result.value.success) {
            Swal.fire({
              title: 'Oops! Ocurrió un error',
              text: result.value.message,
              icon: 'error',
            });
            return;
          }
          console.log('informe de asistencia por planilla', result.value.asistencias);
          this.cargando = false;
          this._designProgressBarService.hide();
          this._fichaAsistenciaGeneralPdf.generatePdf(this.planillaTaller, result.value.asistencias);
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
      console.log('result,', result);
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
          console.log('informe de asistencia por planilla', result.value.asistencias);
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
  setInformeCalificacionesPorTaller(evento) {}
  setInformeCalificacionesResumido(evento) {}
  setSeguimientoPorTaller(evento) {}
  setInformeLibroDeTemas(evento) {}
  setInformeResumenTallerPorAlumnos(evento) {}
  setInformeListadoAlumnosTaller(evento) {}
}
