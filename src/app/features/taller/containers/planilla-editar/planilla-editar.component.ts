import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AsignaturaService } from 'app/core/services/asignatura.service';
import { PlanillaTallerService } from 'app/core/services/planillaTaller.service';
import { ProfesorService } from 'app/core/services/profesor.service';
import { IAsignatura } from 'app/models/interface/iAsignatura';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import { IProfesor } from 'app/models/interface/iProfesor';
import * as moment from 'moment';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-planilla-editar',
  template: `
    <!-- Test -->
    <app-planilla-form
      [cargando]="cargando"
      [cargandoProfesores]="cargandoProfesores$ | async"
      [cargandoAsignaturas]="cargandoAsignaturas$ | async"
      [planillaTaller]="planillaTaller"
      [profesores]="profesores$ | async"
      [asignaturas]="asignaturas$ | async"
      (retPlanilla)="setPlanilla($event)"
    ></app-planilla-form>
  `,
  styles: [],
})
export class PlanillaEditarComponent implements OnInit, OnChanges {
  @Input() cargando: boolean;
  @Input() planillaTaller: IPlanillaTaller;

  profesores$: Observable<IProfesor[]>;
  asignaturas$: Observable<IAsignatura[]>;

  private cargandoProfesoresSubject = new BehaviorSubject<boolean>(false);
  public cargandoProfesores$ = this.cargandoProfesoresSubject.asObservable();

  private cargandoAsignaturasSubject = new BehaviorSubject<boolean>(false);
  public cargandoAsignaturas$ = this.cargandoAsignaturasSubject.asObservable();
  constructor(
    private _planillaTallerService: PlanillaTallerService,
    private _profesorService: ProfesorService,
    private _asignaturaService: AsignaturaService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.planillaTaller && changes.planillaTaller.currentValue) {
    }
  }

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
      console.log('planillaparams', evento);
      const anio = moment(evento.fechaInicio).utc().format('YYYY');
      const planilla: any = {
        ...evento,
        fechaInicio: evento.fechaInicio,
        fechaFinalizacion: evento.fechaFinalizacion,
        observacion: evento.observacion,
        bimestre: evento.bimestre,
        asignatura: evento.asignatura,
        profesor: evento.profesor,
        comision: evento.comision, // set en el back
        division: Number(evento.division), // set en el back
        cursoNro: Number(evento.curso), // set en el back
        anio: Number(anio), // set en el back
        activo: true,
      };

      console.log('evento', planilla);

      this.actualizarPlanillaTaller(planilla);
    }
  }
  actualizarPlanillaTaller(planilla: any) {
    Swal.fire({
      title: '¿Está seguro de continuar?',
      html: 'Está a punto de actualizar la planilla de taller.',
      icon: 'warning',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this._planillaTallerService.actualizarPlanillaTaller(this.planillaTaller._id, planilla).pipe(
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
            text: 'La planilla de taller ha sido actualizada',
            icon: 'success',
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
