import { MediaMatcher, BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AlumnoService } from 'app/core/services/alumno.service';
import { AsistenciaService } from 'app/core/services/asistencia.service';
import { CalificacionService } from 'app/core/services/calificacion.service';
import { PlanillaTallerService } from 'app/core/services/planillaTaller.service';
import { SeguimientoAlumnoService } from 'app/core/services/seguimientoAlumno.service';
import { TemaService } from 'app/core/services/tema.service';
import { TemplateEnum } from 'app/models/constants/tipo-template.const';
import { IAlumno } from 'app/models/interface/iAlumno';
import { IAsistencia } from 'app/models/interface/iAsistencia';
import { ICalificacion } from 'app/models/interface/iCalificacion';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import { ITema } from 'app/models/interface/iTema';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AsistenciaFormModalComponent } from '../asistencia-form-modal/asistencia-form-modal.component';
import { CalificacionFormModalComponent } from '../calificacion-form-modal/calificacion-form-modal.component';
import { TemaFormModalComponent } from '../tema-form-modal/tema-form-modal.component';
@UntilDestroy()
@Component({
  selector: 'app-planilla-taller-administrar',
  template: `
    <button-volver></button-volver>
    <div fxLayout="column" class="w-100-p p-24 mt-50" fxLayoutGap="20px">
      <div fxLayout="column" class="mat-card mat-elevation-z4 p-24">
        <div fxLayout fxLayoutAlign="start center" class="w-100-p mb-12" style="border-bottom: 2px solid #80808057;">
          <h1 [@animate]="{ value: '*', params: { x: '50px' } }" class="px-12">{{ titulo }}</h1>
          <mat-spinner *ngIf="cargando" matSuffix class="ml-10" diameter="20"></mat-spinner>
        </div>
        <mat-tab-group [selectedIndex]="indiceTab" (selectedTabChange)="controlTabs($event)">
          <mat-tab label="General">
            <!-- Componente Smart podria ser UI pero no D: -->
            <app-planilla-editar [cargando]="cargando" [planillaTaller]="planillaTaller"></app-planilla-editar>
          </mat-tab>
          <mat-tab label="Asistencias">
            <app-planilla-detalle-asistencias
              [totalClases]="totalClases"
              [template]="template"
              [cargandoAsistencias]="cargandoAsistencias"
              [cargandoAlumnos]="cargandoAlumnos"
              [alumnos]="alumnos"
              [asistencias]="asistencias"
              (retBuscarAsistenciaPorAlumno)="setBuscarAsistenciaPorAlumno($event)"
              (retAbrirModalAsistencias)="setAbrirModalAsistencias($event)"
              (retEditarAsistencia)="setEditarAsistencia($event)"
              (retEliminarAsistencia)="setEliminarAsistencia($event)"
            ></app-planilla-detalle-asistencias>
            <!-- <app-administrar-asistencias [cargandoAlumnos]="cargandoAlumnos" [alumnos]="alumnos"> </app-administrar-asistencias> -->
          </mat-tab>
          <mat-tab label="Calificaciones">
            <app-planilla-detalle-calificaciones
              [template]="template"
              [cargandoCalificaciones]="cargandoCalificaciones"
              [cargandoAlumnos]="cargandoAlumnos"
              [alumnos]="alumnos"
              [calificaciones]="calificaciones"
              (retAbrirModalCalificaciones)="setAbrirModalCalificaciones($event)"
              (retEditarCalificacion)="setEditarCalificacion($event)"
              (retBuscarCalificacionesPorAlumno)="setBuscarCalificacionesPorAlumno($event)"
              (retEliminarCalificacion)="setEliminarCalificacion($event)"
            >
            </app-planilla-detalle-calificaciones>
          </mat-tab>
          <mat-tab label="Libro de Temas">
            <app-planilla-detalle-temas
              [template]="template"
              [temas]="temas"
              [cargandoTemas]="cargandoTemas"
              (retAbrirModalTemas)="setAbrirModalTemas($event)"
              (retEditarTema)="setEditarTema($event)"
              (retEliminarTema)="setEliminarTema($event)"
            >
            </app-planilla-detalle-temas>
          </mat-tab>
          <mat-tab label="Seguimiento de Alumnos"> </mat-tab>
          <mat-tab label="Informes"> <app-planilla-detalle-informes> </app-planilla-detalle-informes> </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [],
  animations: [designAnimations],
})
export class PlanillaTallerAdministrarComponent implements OnInit {
  template = TemplateEnum.EDICION;
  indiceTab = 0;
  titulo = 'Planilla';
  planillaId;
  tipoPantalla;
  // PlanillaTaller
  planillaTaller: IPlanillaTaller;
  cargando = false;
  cargandoAlumnos = false;
  alumnos: IAlumno[];
  alumnoSeleccionado: IAlumno;
  //   Asistencias
  totalClases;
  asistencias: IAsistencia[];
  cargandoAsistencias: boolean;
  //   Calificaciones
  cargandoCalificaciones: boolean;
  calificaciones: ICalificacion[];
  //   Seguimiento
  //   Temas
  cargandoTemas: boolean;
  temas: ITema[];
  //   Informes
  // Mobile
  isMobile: boolean;
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  constructor(
    private _activeRoute: ActivatedRoute,
    private _alumnoService: AlumnoService,
    private _temaService: TemaService,
    private _asistenciaService: AsistenciaService,
    private _calificacionService: CalificacionService,
    private _planillaTallerService: PlanillaTallerService,
    private _seguimientoAlumnoService: SeguimientoAlumnoService,
    private _dialog: MatDialog,
    private _changeDetectorRef: ChangeDetectorRef,
    private _media: MediaMatcher,
    public breakpointObserver: BreakpointObserver,
    private _router: Router
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
  }

  ngOnInit(): void {
    this._activeRoute.params.subscribe((params) => {
      this.planillaId = params['id'];
      this.tipoPantalla = params['tipo'];
      this.seleccionarTab();
      this.obtenerPlanilla();
    });
  }
  obtenerPlanilla() {
    this.cargando = true;
    this._planillaTallerService
      .obtenerPlanillaTallerPorId(this.planillaId)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.planillaTaller = { ...datos };
          this.obtenerAlumnosPorCursoEspecifico();
          this.cargando = false;
        },
        (error) => {
          this.cargando = false;
          Swal.fire({
            title: 'Planilla de Taller no encontrada',
            text: 'La planilla que está buscando no se encuentra disponible',
            icon: 'error',
          });
          this._router.navigate(['taller/planillas']);
          console.log('[ERROR]', error);
        }
      );
  }
  obtenerAlumnosPorCursoEspecifico() {
    this.cargandoAlumnos = true;
    const { curso, division, comision } = this.planillaTaller.curso;
    this._alumnoService
      .obtenerAlumnosPorCursoEspecifico(curso, comision, division, this.planillaTaller.cicloLectivo)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.alumnos = datos;
          this.cargandoAlumnos = false;
        },
        (error) => {
          this.cargandoAlumnos = false;
          console.log('[ERROR]', error);
        }
      );
  }

  seleccionarTab() {
    switch (this.tipoPantalla) {
      case 'asistencias':
        this.indiceTab = 1;

        break;
      case 'calificaciones':
        this.indiceTab = 2;
        break;
      case 'seguimientos':
        this.indiceTab = 3;
        break;
      case 'temas':
        this.indiceTab = 4;
        break;
      case 'informes':
        this.indiceTab = 5;
        break;
      default:
        this.indiceTab = 0;
        break;
    }
  }
  buscarTotalesPorPlanilla() {
    this._planillaTallerService
      .buscarTotalAsistenciaPorPlanilla(this.planillaId)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          console.log('datos', datos);
          this.totalClases = datos.total;
        },
        (error) => {
          console.log('[ERROR]', error);
          this.cargandoAsistencias = false;
        }
      );
  }
  controlTabs(evento) {
    console.log('controlTabs', evento);
    this.indiceTab = evento.index;
    switch (evento.index) {
      case 0:
        this.titulo = 'Planilla de Taller';
        break;
      case 1:
        this.titulo = 'Asistencias del Alumno';
        // Si hay asistencias entonces hay alumnoSeleccionado. Controlamos para no repetir la consulta
        if (
          (!this.asistencias && this.alumnoSeleccionado) ||
          (this.asistencias && this.asistencias.length > 0 && this.alumnoSeleccionado._id !== this.asistencias[0].alumno._id)
        ) {
          this.setBuscarAsistenciaPorAlumno(this.alumnoSeleccionado);
        }
        if (!this.totalClases) {
          this.buscarTotalesPorPlanilla();
        }
        break;
      case 2:
        this.titulo = 'Calificaciones del Alumno';
        if (
          (!this.calificaciones && this.alumnoSeleccionado) ||
          (this.calificaciones && this.calificaciones.length > 0 && this.alumnoSeleccionado._id !== this.calificaciones[0].alumno._id)
        ) {
          this.setBuscarCalificacionesPorAlumno(this.alumnoSeleccionado);
        }
        break;
      case 3:
        this.titulo = 'Libro de Temas del Profesor';
        if (!this.temas) {
          this.obtenerLibroDeTemas();
        }
        break;
      case 4:
        this.titulo = 'Seguimiento del Alumno';
        // if (
        //   (!this.seguimientos && this.alumnoSeleccionado) ||
        //   (this.seguimientos && this.seguimientos.length > 0 && this.alumnoSeleccionado._id !== this.seguimientos[0].alumno._id)
        // ) {
        //   this.setBuscarSeguimientosPorAlumno(this.alumnoSeleccionado);
        // }
        break;
      case 5:
        this.titulo = 'Informes';
        console.log('INFORMES');
        break;

      default:
        break;
    }
  }
  //   Temas
  obtenerLibroDeTemas() {
    this.cargandoTemas = true;
    this._temaService
      .obtenerTemaPorPlanillaTaller(this.planillaId)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.temas = datos;
          console.log('temas', this.temas);
          this.cargandoTemas = false;
        },
        (error) => {
          this.cargandoTemas = false;
          console.log('[ERROR]', error);
        }
      );
  }
  //   Output Asistencias
  setBuscarAsistenciaPorAlumno(alumno: IAlumno) {
    console.log('1');
    this.alumnoSeleccionado = alumno;
    this.cargandoAsistencias = true;
    this._asistenciaService
      .obtenerAsistenciasPorAlumnoId(alumno._id, this.planillaId)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.asistencias = [...datos];
          this.cargandoAsistencias = false;
        },
        (error) => {
          console.log('[ERROR]', error);
          this.cargandoAsistencias = false;
        }
      );
  }
  setAbrirModalAsistencias(evento: boolean) {
    if (!this.alumnoSeleccionado) {
      Swal.fire({
        title: 'Seleccione un alumno',
        text: 'Para administrar las asistencias debe seleccionar al alumno',
        icon: 'error',
      });
      return;
    }
    const dialogRef = this._dialog.open(AsistenciaFormModalComponent, {
      data: { planillaTaller: this.planillaTaller, alumno: this.alumnoSeleccionado },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.setBuscarAsistenciaPorAlumno(this.alumnoSeleccionado);
      }
    });
  }
  setEditarAsistencia(evento: IAsistencia) {
    if (!this.alumnoSeleccionado) {
      Swal.fire({
        title: 'Seleccione un alumno',
        text: 'Para administrar las asistencias debe seleccionar al alumno',
        icon: 'error',
      });
      return;
    }
    if (!evento) {
      Swal.fire({
        title: 'Seleccione una asistencia',
        text: 'Para editar la asistencia debe seleccionarla primero',
        icon: 'error',
      });
      return;
    }
    console.log('evento', evento);
    const dialogRef = this._dialog.open(AsistenciaFormModalComponent, {
      data: { asistencia: evento, planillaTaller: this.planillaTaller, alumno: this.alumnoSeleccionado },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.setBuscarAsistenciaPorAlumno(this.alumnoSeleccionado);
      }
    });
  }
  setEliminarAsistencia(asistencia: IAsistencia) {
    Swal.fire({
      title: '¿Está seguro de continuar?',
      html: 'Está a punto de <strong>ELIMINAR PERMANENTEMENTE</strong> la asistencia',
      icon: 'warning',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this._asistenciaService.eliminar(asistencia._id).pipe(
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
          Swal.fire({
            title: 'Operación Exitosa',
            text: 'La asistencia ha sido actualizado correctamente.',
            icon: 'success',
          });
          this.setBuscarAsistenciaPorAlumno(this.alumnoSeleccionado);
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
  // Output Calificaciones
  setBuscarCalificacionesPorAlumno(alumno: IAlumno) {
    console.log('2');
    this.alumnoSeleccionado = alumno;
    this.cargandoCalificaciones = true;
    this._calificacionService
      .obtenerCalificacionesPorAlumnoId(alumno._id, this.planillaId)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.calificaciones = [...datos];
          this.cargandoCalificaciones = false;
        },
        (error) => {
          console.log('[ERROR]', error);
          this.cargandoCalificaciones = false;
        }
      );
  }
  setAbrirModalCalificaciones(evento) {
    if (!this.alumnoSeleccionado) {
      Swal.fire({
        title: 'Seleccione un alumno',
        text: 'Para gestionar las calificaciones debe seleccionar al alumno',
        icon: 'error',
      });
      return;
    }
    const dialogRef = this._dialog.open(CalificacionFormModalComponent, {
      data: { planillaTaller: this.planillaTaller, alumno: this.alumnoSeleccionado },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.setBuscarCalificacionesPorAlumno(this.alumnoSeleccionado);
      }
    });
  }
  setEditarCalificacion(evento) {
    if (!this.alumnoSeleccionado) {
      Swal.fire({
        title: 'Seleccione un alumno',
        text: 'Para gestionar las calificaciones debe seleccionar al alumno',
        icon: 'error',
      });
      return;
    }
    if (!evento) {
      Swal.fire({
        title: 'Seleccione la calificación',
        text: 'Para editar la calificación debe seleccionarla primero',
        icon: 'error',
      });
      return;
    }
    const dialogRef = this._dialog.open(CalificacionFormModalComponent, {
      data: { calificacion: evento, planillaTaller: this.planillaTaller, alumno: this.alumnoSeleccionado },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      console.log('resultado', resultado);
      if (resultado) {
        this.setBuscarCalificacionesPorAlumno(this.alumnoSeleccionado);
      }
    });
  }
  setEliminarCalificacion(calificacion: ICalificacion) {
    Swal.fire({
      title: '¿Está seguro de continuar?',
      html: 'Está a punto de <strong>ELIMINAR PERMANENTEMENTE</strong> la calificación',
      icon: 'warning',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this._calificacionService.eliminar(calificacion._id).pipe(
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
          Swal.fire({
            title: 'Operación Exitosa',
            text: 'La calificación ha sido actualizado correctamente.',
            icon: 'success',
          });
          this.setBuscarCalificacionesPorAlumno(this.alumnoSeleccionado);
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
  // TEmas
  setAbrirModalTemas(evento) {
    const dialogRef = this._dialog.open(TemaFormModalComponent, {
      data: { planillaTaller: this.planillaTaller },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      console.log('resultado', resultado);
      if (resultado) {
        this.obtenerLibroDeTemas();
      }
    });
  }
  setEditarTema(tema: ITema) {
    const dialogRef = this._dialog.open(TemaFormModalComponent, {
      data: { planillaTaller: this.planillaTaller, tema: tema },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      console.log('resultado', resultado);
      if (resultado) {
        this.obtenerLibroDeTemas();
      }
    });
  }
  setEliminarTema(tema: ITema) {
    Swal.fire({
      title: '¿Está seguro de continuar?',
      html: 'Está a punto de <strong>ELIMINAR PERMANENTEMENTE</strong> el tema',
      icon: 'warning',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this._temaService.eliminar(tema._id).pipe(
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
          Swal.fire({
            title: 'Operación Exitosa',
            text: 'El tema ha sido actualizado correctamente.',
            icon: 'success',
          });
          this.obtenerLibroDeTemas();
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
