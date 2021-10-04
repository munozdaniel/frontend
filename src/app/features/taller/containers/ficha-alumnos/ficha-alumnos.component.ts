import { Component, OnInit } from '@angular/core';
import { designAnimations } from '@design/animations';
import { DesignProgressBarService } from '@design/components/progress-bar/progress-bar.service';
import { AlumnoService } from 'app/core/services/alumno.service';
import { IAlumno } from 'app/models/interface/iAlumno';
import { Observable, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IFichaAlumnoParam } from 'app/models/interface/iFichaAlumnoParam';
import { ALUMNO_OPERACION } from 'app/models/constants/alumno-operacion.enum';
import Swal from 'sweetalert2';
import { ToastService } from 'app/core/services/general/toast.service';
import { ICicloLectivo } from 'app/models/interface/iCicloLectivo';
import { CicloLectivoService } from 'app/core/services/ciclo-lectivo.service';
import { AlumnosPromediosPdf } from 'app/core/services/pdf/alumnos-promedios';
import { CalificacionService } from 'app/core/services/calificacion.service';

@UntilDestroy()
@Component({
  selector: 'app-ficha-alumnos',
  templateUrl: './ficha-alumnos.component.html',
  styles: [],
  animations: designAnimations,
})
export class FichaAlumnosComponent implements OnInit {
  titulo = 'Buscar fichas de alumnos/as';
  cargando = false;
  alumnos: IAlumno[];
  alumnoOperacion = ALUMNO_OPERACION;
  ciclosLectivos: ICicloLectivo[];
  parametros: IFichaAlumnoParam;
  constructor(
    private _toastService: ToastService,
    private _alumnoService: AlumnoService,
    private _cicloLectivoService: CicloLectivoService,
    private _alumnoPromediosPdf: AlumnosPromediosPdf,
    private _calificacionService: CalificacionService,
    private _designProgressBar: DesignProgressBarService
  ) {}

  ngOnInit(): void {
    this._alumnoService.fichaAlumno$.pipe(untilDestroyed(this)).subscribe((datos) => {
      if (datos) {
        this.parametros = { ...datos };
        this.obtenerAlumnos();
      }
    });
    this._cicloLectivoService
      .obtenerCiclosLectivos()
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.ciclosLectivos = datos;
        },
        (error) => {
          console.log('[ERROR]', error);
        }
      );
  }
  obtenerAlumnos() {
    this.cargando = true;
    const { cicloLectivo, division, curso } = this.parametros;
    this._alumnoService
      .obtenerFichaAlumnos(cicloLectivo, division, curso)
      .pipe(untilDestroyed(this))
      .subscribe(
        (alumnos) => {
          this.alumnos = alumnos;
          if (alumnos.length < 1) {
            this._toastService.sinRegistros();
          }
          this.cargando = false;
        },
        (error) => {
          this.cargando = false;
          console.log('[ERROR]', error);
          Swal.fire({
            title: 'Oops! Ocurrió un error',
            html: 'No se pudieron recuperar los registros de la base de datos. <br> Si el problema persiste comuniquesé con el soporte técnico.',
            icon: 'error',
          });
        }
      );
  }
  setParametrosBusqueda(evento: IFichaAlumnoParam) {
    if (evento) {
      this._alumnoService.setFichaAlumnoConsulta(evento);
    }
  }
  setInformePromediosPorTaller(alumno: IAlumno) {
    this.cargando = true;
    // this._designProgressBarService.show();

    Swal.fire({
      title: 'Generar Informe de Promedios',
      html: 'El proceso puede tardar varios minutos debido a la cantidad de datos que se procesan. <br> <strong>¿Desea continuar?</strong>',
      icon: 'warning',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this._calificacionService.informePromediosPorTaller(alumno._id).pipe(
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
          if (!result.value.calificaciones || result.value.calificaciones.length < 1) {
            Swal.fire({
              title: 'Informe cancelado',
              text: 'El alumno seleccionado no tiene calificaciones cargadas',
              icon: 'error',
            });
            return;
          }
          this._alumnoPromediosPdf.generatePdf(alumno, result.value.calificaciones);
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
