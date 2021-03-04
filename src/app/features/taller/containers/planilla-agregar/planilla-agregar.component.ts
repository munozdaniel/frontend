import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { designAnimations } from '@design/animations';
import { AsignaturaService } from 'app/core/services/asignatura.service';
import { ComisionService } from 'app/core/services/comision.service';
import { PlanillaTallerService } from 'app/core/services/planillaTaller.service';
import { ProfesorService } from 'app/core/services/profesor.service';
import { IAsignatura } from 'app/models/interface/iAsignatura';
import { IComision } from 'app/models/interface/iComision';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import { IProfesor } from 'app/models/interface/iProfesor';
import * as moment from 'moment';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-planilla-agregar',
  templateUrl: './planilla-agregar.component.html',
  styleUrls: ['./planilla-agregar.component.scss'],
  animations: [designAnimations],
})
export class PlanillaAgregarComponent implements OnInit {
  titulo = 'Agregar Planilla de Taller';
  cargando = false;
  profesores$: Observable<IProfesor[]>;
  asignaturas$: Observable<IAsignatura[]>;

  private cargandoProfesoresSubject = new BehaviorSubject<boolean>(false);
  public cargandoProfesores$ = this.cargandoProfesoresSubject.asObservable();

  private cargandoAsignaturasSubject = new BehaviorSubject<boolean>(false);
  public cargandoAsignaturas$ = this.cargandoAsignaturasSubject.asObservable();
  constructor(
    private _planillaTallerService: PlanillaTallerService,
    private _profesorService: ProfesorService,
    private _asignaturaService: AsignaturaService,
    private _comisionService: ComisionService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.recuperarProfesores();
    this.recuperarAsignaturas();
  }
  recuperarProfesores() {
    this.cargandoProfesoresSubject.next(true);
    this.profesores$ = this._profesorService.obtenerProfesoresHabilitadas().pipe(
      catchError(() => of([])),
      finalize(() => this.cargandoProfesoresSubject.next(false))
    );
  }
  recuperarAsignaturas() {
    this.cargandoAsignaturasSubject.next(true);
    this.asignaturas$ = this._asignaturaService.obtenerAsignaturasHabilitadas().pipe(
      catchError(() => of([])),
      finalize(() => this.cargandoAsignaturasSubject.next(false))
    );
  }
  setPlanilla(evento) {
    if (evento) {
      const planilla: IPlanillaTaller = {
        fechaInicio: evento.fechaInicio,
        fechaFinalizacion: evento.fechaFinalizacion,
        observacion: evento.observacion,
        bimestre: evento.bimestre,
        asignatura: evento.asignatura,
        profesor: evento.profesor,
        curso: evento.curso, //setear
        activo: true,
      };
      const comision: IComision = {
        activo: true,
        curso: evento.curso,
        division: evento.division,
        comision: evento.comision,
        cicloLectivo: evento.cicloLectivo,
      };
      console.log('planilla', planilla);
      console.log('comision', comision);
      //   this._comisionService.obtenerComisionPorParametros(comision).subscribe(
      //     (unaComision: IComision) => {
      //       if (!unaComision) {
      //         Swal.fire({
      //           title: 'Oops! Ocurrió un error',
      //           text: 'Hubo un problema en el servidor. Si el problema persiste comuniquese con el soporte técnico.',
      //           icon: 'error',
      //         });
      //       } else {
      //         planilla.curso = unaComision._id;
      //         this.guardarPlanillaTaller(planilla);
      //       }
      //     },
      //     (error) => {
      //       console.log('[ERROR]', error);
      //     }
      //   );
    }
  }

  guardarPlanillaTaller(planilla: IPlanillaTaller) {
    Swal.fire({
      title: '¿Está seguro de continuar?',
      html: 'Está a punto de guardar una nueva planilla de taller.',
      icon: 'warning',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this._planillaTallerService.agregarPlanillaTaller(planilla).pipe(
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
        console.log('guaraddo', result);
        if (result.value) {
          Swal.fire({
            title: 'Operación Exitosa',
            text: 'Espere un momento, está siendo redireccionado.',
            icon: 'success',
          });
          //   this._router.navigate(['/taller/planillas-editar/' + result.value._id]);
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
