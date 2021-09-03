import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AlumnoService } from 'app/core/services/alumno.service';
import { CalificacionService } from 'app/core/services/calificacion.service';
import { AlumnosPromediosPdf } from 'app/core/services/pdf/alumnos-promedios';
import { FichaAlumnoPdf } from 'app/core/services/pdf/ficha-alumno.pdf';
import { ALUMNO_OPERACION } from 'app/models/constants/alumno-operacion.enum';
import { ALUMNO_ELIMINADO_SUCCESS, ERROR_EJECUTAR_API, OPERACION_INTERRUMPIDA } from 'app/models/constants/respuestas.const';
import { IAlumno } from 'app/models/interface/iAlumno';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
@UntilDestroy()
@Component({
  selector: 'app-alumnos',
  template: `
    <div class="w-100-p p-24" fxLayout="column">
      <app-alumnos-menu-param [cargando]="cargando" (retAgregarAlumno)="setAgregarAlumno($event)"> </app-alumnos-menu-param>
      <app-alumnos-tabla-param
        [cargando]="cargando"
        [alumnos]="alumnos"
        (retAgregarAlumno)="setAgregarAlumno($event)"
        (retEliminarAlumno)="setEliminarAlumno($event)"
        (retInformePromediosPorTaller)="setInformePromediosPorTaller($event)"
        (retFichaAlumno)="setFichaAlumno($event)"
      ></app-alumnos-tabla-param>
    </div>
  `,
  styles: [],
})
export class AlumnosComponent implements OnInit {
  alumnoOperacion = ALUMNO_OPERACION;
  alumnos: IAlumno[] = [];
  // alumnos$: Observable<IAlumno[]>;
  cargando = false;
  constructor(
    private _fichaAlumnoPdf: FichaAlumnoPdf,
    private _alumnoPromediosPdf: AlumnosPromediosPdf,
    private _router: Router,
    private _alumnoService: AlumnoService,
    private _calificacionService: CalificacionService
  ) {}

  ngOnInit(): void {
    this.obtenerAlumnos();
  }
  obtenerAlumnos() {
    this.cargando = true;
    this._alumnoService
      .obtenerAlumnos()
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.cargando = false;
          this.alumnos = datos;
        },
        (error) => {
          this.cargando = false;
          console.log('[ERROR]', error);
        }
      );
  }
  setAgregarAlumno(evento: boolean) {
    if (evento) {
      this._router.navigate(['/parametrizar/alumnos-agregar']);
    }
  }

  setEliminarAlumno(evento: IAlumno) {
    if (evento) {
      const unAlumno: IAlumno = evento;
      this.confirmarEliminar(unAlumno);
    }
  }
  confirmarEliminar(unAlumno: IAlumno) {
    Swal.fire({
      title: '¿Está seguro de continuar?',
      html: 'Está a punto de <strong>ELIMINAR</strong> el alumno',
      icon: 'warning',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this._alumnoService.toggleEstadoAlumno(unAlumno._id, !unAlumno.activo).pipe(
          catchError((error) => {
            console.log('[ERROR]', error);
            Swal.fire({
              title: 'Oops! Ocurrió un error',
              text: error.error ? error.error.message : ERROR_EJECUTAR_API,
              icon: 'error',
            });
            return of(error);
          })
        );
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result: any) => {
      if (result && result.value.error) {
        Swal.fire({
          title: 'Oops! Ocurrió un error',
          text: result.value.error.error ? result.value.error.error : OPERACION_INTERRUMPIDA,
          icon: 'error',
        });
      }
      if (result.isConfirmed) {
        const resultado = result.value;
        if (!resultado.error) {
          if (resultado.success) {
            Swal.fire({
              title: 'Operación Finalizada',
              text: ALUMNO_ELIMINADO_SUCCESS,
              icon: 'success',
            });
            this.obtenerAlumnos();
          } else {
            Swal.fire({
              title: 'Oops! Ocurrió un error',
              text: resultado.message ? resultado.message : OPERACION_INTERRUMPIDA,
              icon: 'error',
            });
          }
        }
      }
    });
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
  setFichaAlumno(evento: IAlumno) {
    this._alumnoService
      .buscarCursadasPorAlumnoId(evento._id)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          console.log('datos', datos);
          this._fichaAlumnoPdf.generatePdf(datos);
        },
        (error) => {
          console.log('[ERROR]', error);
        }
      );
  }
}
