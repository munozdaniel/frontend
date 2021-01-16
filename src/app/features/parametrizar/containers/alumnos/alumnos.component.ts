import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AlumnoService } from 'app/core/services/alumno.service';
import { ALUMNO_ELIMINADO_SUCCESS, ERROR_EJECUTAR_API, OPERACION_INTERRUMPIDA } from 'app/models/constants/respuestas.const';
import { IAlumno } from 'app/models/interface/iAlumno';
import { IAlumnoPaginado } from 'app/models/interface/iAlumnoPaginado';
import { IPaginado } from 'app/models/interface/iPaginado';
import { IQueryPag } from 'app/models/interface/iQueryPag';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
@UntilDestroy()
@Component({
  selector: 'app-alumnos',
  template: `
    <div class="w-100-p p-24" fxLayout="column">
      <app-alumnos-menu-param [cargando]="cargando" (retAgregarAlumno)="setAgregarAlumno($event)" fxFlex="100"> </app-alumnos-menu-param>
      <app-alumnos-tabla-param
        [total]="total"
        [totalAlumnosPorPagina]="totalAlumnosPorPagina"
        [cargando]="cargando"
        [alumnos]="alumnos"
        (retEliminarAlumno)="setEliminarAlumno($event)"
        (retCambiarPagina)="setCambiarPagina($event)"
        fxFlex="100"
      ></app-alumnos-tabla-param>

      <button mat-flat-button (click)="obtenerAlumnos()">ObtenerAlumnos</button>
    </div>
  `,
  styles: [],
})
export class AlumnosComponent implements OnInit {
  consulta: IQueryPag = {
    ordenBy: null,
    page: null,
    limit: null,
    query: null,
    select: null,
  };
  total: number;
  totalAlumnosPorPagina = 5;
  alumnos: IAlumno[] = [];
  // alumnos$: Observable<IAlumno[]>;
  cargando = false;
  constructor(private _router: Router, private _alumnoService: AlumnoService) {}

  ngOnInit(): void {
    this.consulta.page = 0;
    this.consulta.limit = this.totalAlumnosPorPagina;
    this.obtenerAlumnos();
  }
  obtenerAlumnos() {
    this.cargando = true;
    console.log('this.consulta', this.consulta);
    this._alumnoService
      .obtenerAlumnosPaginados(this.consulta)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos: IAlumnoPaginado) => {
          console.log('datos', datos);
          this.cargando = false;
          this.alumnos = [...datos.docs];
          this.total = datos.total;
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

  setCambiarPagina(evento: IPaginado) {
    if (evento) {
      this.consulta.page = evento.pageIndex;
      this.consulta.limit = evento.pageSize;
      this.obtenerAlumnos();
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
      html: 'Está a punto de <strong>ELIMINAR</eliminar> el alumno',
      icon: 'warning',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this._alumnoService.deshabilitarAlumno(unAlumno._id, !unAlumno.activo).pipe(
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
      console.log('[result]', result);
      if (result && result.value.error) {
        Swal.fire({
          title: 'Oops! Ocurrió un error',
          text: result.value.error.error ? result.value.error.error : OPERACION_INTERRUMPIDA,
          icon: 'error',
        });
      }
      if (result.isConfirmed) {
        const resultado = result.value;
        console.log('result1', resultado);
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
}
