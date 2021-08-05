import { MediaMatcher, BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthService } from 'app/core/auth/auth.service';
import { AlumnoService } from 'app/core/services/alumno.service';
import { AsistenciaService } from 'app/core/services/asistencia.service';
import { CalificacionService } from 'app/core/services/calificacion.service';
import { PlanillaTallerService } from 'app/core/services/planillaTaller.service';
import { SeguimientoAlumnoService } from 'app/core/services/seguimientoAlumno.service';
import { TemaService } from 'app/core/services/tema.service';
import { RolConst } from 'app/models/constants/rol.enum';
import { TemplateEnum } from 'app/models/constants/tipo-template.const';
import { IAlumno } from 'app/models/interface/iAlumno';
import { IAsistencia } from 'app/models/interface/iAsistencia';
import { ICalendario } from 'app/models/interface/iCalendario';
import { ICalificacion } from 'app/models/interface/iCalificacion';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import { ISeguimientoAlumno } from 'app/models/interface/iSeguimientoAlumno';
import { ITema } from 'app/models/interface/iTema';
import { ITemaPendiente } from 'app/models/interface/iTemaPendiente';
import { IUsuario } from 'app/models/interface/iUsuario';
import { EmailAusenteModalComponent } from 'app/shared/components/email-ausente-modal/email-ausente-modal.component';
import { SeguimientoFormModalComponent } from 'app/shared/components/seguimiento-form-modal/seguimiento-form-modal.component';
import { TomarAsistenciaModalComponent } from 'app/shared/components/tomar-asistencia-modal/tomar-asistencia-modal.component';
import { of } from 'rxjs';
import { catchError, ignoreElements } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AsistenciaFormModalComponent } from '../asistencia-form-modal/asistencia-form-modal.component';
import { CalificacionFormModalComponent } from '../calificacion-form-modal/calificacion-form-modal.component';
import { ExamenModalComponent } from '../examen-modal/examen-modal.component';
import { TemaFormModalComponent } from '../tema-form-modal/tema-form-modal.component';
@UntilDestroy()
@Component({
  selector: 'app-planilla-taller-administrar',
  template: `
    <button-volver></button-volver>
    <div fxLayout="column" class="w-100-p p-24 mt-50" fxLayoutGap="20px">
      <div fxLayout="column" class="mat-card mat-elevation-z4 p-24">
        <div fxLayout="row wrap" fxLayoutAlign="space-between center" class="w-100-p mb-12" style="border-bottom: 2px solid #80808057;">
          <div>
            <h1 [@animate]="{ value: '*', params: { x: '50px' } }" class="px-12">{{ titulo }}</h1>
            <mat-spinner *ngIf="cargando" matSuffix class="ml-10" diameter="20"></mat-spinner>
          </div>
          <div *ngIf="alumnoSeleccionado" fxFlex.xs="100">
            <h3
              [@animate]="{ value: '*', params: { x: '50px' } }"
              fxLayoutAlign.xs="center center"
              fxLayout="row"
              fxLayoutGap="10px"
              class="legajo"
            >
              <strong>Legajo:</strong><span>{{ alumnoSeleccionado.legajo }}</span>
            </h3>
          </div>
        </div>
        <mat-tab-group [selectedIndex]="indiceTab" (selectedTabChange)="controlTabs($event)">
          <mat-tab label="General">
            <!-- Componente Smart podria ser UI pero no D: -->
            <app-planilla-editar
              [cargando]="cargando"
              [planillaTaller]="planillaTaller"
              (retPlanillaActualizada)="setPlanillaActualizada($event)"
            ></app-planilla-editar>
          </mat-tab>

          <mat-tab label="Asistencias">
            <app-planilla-detalle-asistencias
              [template]="template"
              [asistenciasHoy]="asistenciasHoy"
              [cargandoAsistencias]="cargandoAsistencias"
              [cargandoAlumnos]="cargandoAlumnos"
              [alumnos]="alumnos"
              [asistencias]="asistencias"
              [deshabilitarEdicion]="deshabilitarEdicion"
              (retBuscarAsistenciaPorAlumno)="setBuscarAsistenciaPorAlumno($event)"
              (retAbrirModalAsistencias)="setAbrirModalAsistencias($event)"
              (retTomarAsistencias)="setTomarAsistencias($event)"
              (retEditarAsistencia)="setEditarAsistencia($event)"
              (retEliminarAsistencia)="setEliminarAsistencia($event)"
              (retEnviarEmail)="setEnviarEmail($event)"
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
              (retBuscarCalificacionesPorAlumno)="setBuscarCalificacionesPorAlumno($event)"
              (retAbrirModalCalificaciones)="setAbrirModalCalificaciones($event)"
              (retEditarCalificacion)="setEditarCalificacion($event)"
              (retEliminarCalificacion)="setEliminarCalificacion($event)"
              [deshabilitarEdicion]="deshabilitarEdicion"
              (retExamenEspecial)="setExamenEspecial($event)"
            >
            </app-planilla-detalle-calificaciones>
          </mat-tab>
          <mat-tab label="Libro de Temas">
            <app-planilla-detalle-temas
              [template]="template"
              [temas]="temas"
              [temasIncompletos]="temasIncompletos"
              [reset]="resetTema"
              [isUpdate]="!deshabilitarEdicion"
              [planillaTaller]="planillaTaller"
              [cargandoTemas]="cargandoTemas"
              (retAbrirModalTemas)="setAbrirModalTemas($event)"
              (retEditarTema)="setEditarTema($event)"
              (retEliminarTema)="setEliminarTema($event)"
              (retEliminarTemas)="setEliminarTemas($event)"
              (retCargarLista)="setCargarLista($event)"
              (retInformarIncompletos)="setInformarIncompletos($event)"
            >
              <!-- (retTemasCalendario)="setTemasCalendario($event)" -->
            </app-planilla-detalle-temas>
          </mat-tab>
          <mat-tab *ngxPermissionsOnly="['ADMIN', 'JEFETALLER']" label="Calendario">
            <!-- Componente Smart podria ser UI pero no D: -->
            <app-planilla-calendario [cargando]="cargando" [planillaTaller]="planillaTaller" [calendario]="calendario">
            </app-planilla-calendario>
          </mat-tab>
          <mat-tab label="Seguimiento de Alumnos">
            <app-planilla-detalle-seguimiento
              [template]="template"
              [cicloLectivo]="planillaTaller?.cicloLectivo"
              [seguimientos]="seguimientos"
              [cargandoAlumnos]="cargandoAlumnos"
              [alumnos]="alumnos"
              [cargandoSeguimiento]="cargandoSeguimiento"
              (retBuscarSeguimientosPorAlumno)="setBuscarSeguimientosPorAlumno($event)"
              (retAbrirModalSeguimiento)="setAbrirModalSeguimiento($event)"
              (retEliminarSeguimiento)="setEliminarSeguimiento($event)"
              (retEditarSeguimiento)="setEditarSeguimiento($event)"
              [deshabilitarEdicion]="deshabilitarEdicion"
            >
            </app-planilla-detalle-seguimiento>
          </mat-tab>
          <mat-tab label="Informes">
            <app-informes [planillaTaller]="planillaTaller"> </app-informes>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [
    `
      .legajo {
        border: 1px solid gray;
        padding: 2px 10px;
        margin: 0;
        /* text-decoration: underline; */
        background: #3f3f3f;
        text-shadow: 0 0 #000000;
        color: white;
      }
    `,
  ],
  animations: [designAnimations],
})
export class PlanillaTallerAdministrarComponent implements OnInit {
  usuario: IUsuario;
  resetTema = 0;
  asistenciasHoy: { presentes: 0; ausentes: 0 };
  anioActual = new Date().getFullYear();
  deshabilitarEdicion = false;
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
  alumnoId: string;
  seguimientoId: string;
  //   Calendario
  calendario: ICalendario[];
  //   Asistencias
  totalClases;
  asistencias: IAsistencia[];
  cargandoAsistencias: boolean;
  //   Calificaciones
  cargandoCalificaciones: boolean;
  calificaciones: ICalificacion[];
  //   Temas
  cargandoTemas: boolean;
  temas: ITema[];
  temasDelCalendario: ITema[];
  temasIncompletos: ITemaPendiente[];
  //   Seguimiento
  seguimientos: ISeguimientoAlumno[];
  cargandoSeguimiento: boolean;
  //   Informes
  // Mobile
  isMobile: boolean;
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  constructor(
    private _activeRoute: ActivatedRoute,
    private _authService: AuthService,
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
    this._authService.currentUser$.pipe(untilDestroyed(this)).subscribe((datos) => {
      this.usuario = datos;
    });
    this.suscripcionAsistenciasHoy();
  }

  ngOnInit(): void {
    this._activeRoute.params.subscribe((params) => {
      this.planillaId = params['id'];
      this.tipoPantalla = params['tipo'];
      this.seguimientoId = params['seguimientoId'];

      this.obtenerPlanilla();
    });
  }
  obtenerSeguimiento() {
    this._seguimientoAlumnoService
      .obtenerSeguimientoPorIdCompleto(this.seguimientoId)
      .pipe(untilDestroyed(this))
      .subscribe(
        ({ seguimiento }) => {
          //   if (this.usuario.rol === RolConst.ADMIN || this.usuario.rol === RolConst.JEFETALLER) {
          //     this.indiceTab = 5;
          //   } else {
          //     this.indiceTab = 4;
          //   }
          const index = this.alumnos.findIndex((x) => x._id === seguimiento.alumno._id);
          if (index !== -1) {
            this.alumnoSeleccionado = this.alumnos[index];
            this.setBuscarSeguimientosPorAlumno(this.alumnoSeleccionado);
            this.setEditarSeguimiento(seguimiento);
          }
        },
        (error) => {
          console.log('[ERROR]', error);
        }
      );
  }
  suscripcionAsistenciasHoy() {
    this._asistenciaService.asistenciasHoy$.pipe(untilDestroyed(this)).subscribe((datos) => {
      this.asistenciasHoy = datos;
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
          if (this.planillaTaller.cicloLectivo.anio < this.anioActual) {
            this.deshabilitarEdicion = true;
          }

          if (this.planillaTaller.curso) {
            if (!this.planillaTaller.personalizada) {
              this.obtenerAlumnosPorCursoEspecifico();
            } else {
              this.obtenerAlumnosPorPlanillaPersonalizada();
            }
          }
          this.cargando = false;
          this.buscarAsistenciasHoy();
        },
        (error) => {
          this.cargando = false;
          Swal.fire({
            title: 'Planilla de Taller no encontrada',
            text: 'Puede que el registro que busca ya no se encuentre disponible',
            icon: 'error',
          });
          this._router.navigate(['taller/planillas']);
          console.log('[ERROR]', error);
        }
      );
  }
  buscarAsistenciasHoy() {
    this._asistenciaService.buscarAsistenciasHoy(this.planillaTaller._id);
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
          this.seleccionarTab(); // Por si viene por parametro
          if (this.seguimientoId) {
            this.obtenerSeguimiento();
          }
        },
        (error) => {
          this.cargandoAlumnos = false;
          console.log('[ERROR]', error);
        }
      );
  }
  obtenerAlumnosPorPlanillaPersonalizada() {
    this.cargandoAlumnos = true;
    // TODO: Que traiga los alumnos seleccionados
    this._alumnoService
      .obtenerAlumnosPorPlanillaPersonalizada(this.planillaTaller._id)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.alumnos = datos
            .map((x) => {
              if (x.selected) {
                return { ...x.alumno };
              }
            })
            .filter((x) => x);
          this.cargandoAlumnos = false;
          this.seleccionarTab(); // Por si viene por parametro
          if (this.seguimientoId) {
            this.obtenerSeguimiento();
          }
        },
        (error) => {
          this.cargandoAlumnos = false;
          console.log('[ERROR]', error);
        }
      );
  }

  seleccionarTab() {
    switch (this.tipoPantalla) {
      case 'general':
        this.indiceTab = 1;

        break;
      case 'asistencias':
        this.indiceTab = 1;

        break;
      case 'calificaciones':
        this.indiceTab = 2;
        break;
      case 'temas':
        this.indiceTab = 3;
        break;
      case 'seguimientos':
        if (this.usuario.rol === RolConst.ADMIN || this.usuario.rol === RolConst.JEFETALLER) {
          this.indiceTab = 5;
        } else {
          this.indiceTab = 4;
        }
        // const index = this.alumnos.findIndex((x) => x._id === this.alumnoId);
        // console.log('index', index);
        // if (index !== -1) {
        //   this.alumnoSeleccionado = this.alumnos[index];
        //   this.setBuscarSeguimientosPorAlumno(this.alumnoSeleccionado);
        //   this.setEditarSeguimiento();
        // }
        break;

      case 'informes':
        if (this.usuario.rol === RolConst.ADMIN || this.usuario.rol === RolConst.JEFETALLER) {
          this.indiceTab = 6;
        } else {
          this.indiceTab = 5;
        }
        break;
      default:
        this.indiceTab = 0;
        break;
    }
  }

  controlTabs(evento) {
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
          this.obtenerClasesDetalle();
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
          this.obtenerClasesDetalle();
        }
        break;
      case 4:
        if (this.usuario.rol === RolConst.ADMIN || this.usuario.rol === RolConst.JEFETALLER) {
          this.titulo = 'Calendario ';
          if (!this.calendario) {
            this.obtenerClasesDetalle();
          }
        } else {
          this.titulo = 'Seguimiento del Alumno';
        }

        break;
      case 5:
        if (this.usuario.rol === RolConst.ADMIN || this.usuario.rol === RolConst.JEFETALLER) {
          this.titulo = 'Seguimiento del Alumno';
        } else {
          this.titulo = 'Informes';
        }
        break;
      case 6:
        this.titulo = 'Informes';
        break;

      default:
        break;
    }
  }
  obtenerClasesDetalle() {
    this.cargandoTemas = true;
    this.cargando = true;
    this._temaService
      .obtenerTemasCalendario(this.planillaTaller._id)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.temas = [...datos.temas];
          this.calendario = [...datos.calendario];
          this.totalClases = datos.totalClases;
          this.cargando = false;
          this.cargandoTemas = false;
          this.obtenerTemasIncompletos();
        },
        (error) => {
          console.log('[ERROR]', error);
          this.cargando = false;
          this.cargandoTemas = false;
        }
      );
  }

  //   Output Asistencias
  setExamenEspecial(evento) {
    const dialogRef = this._dialog.open(ExamenModalComponent, {
      width: '330px',
      data: { alumnoId: this.alumnoSeleccionado._id, planillaId: this.planillaId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }
  setBuscarAsistenciaPorAlumno(alumno: IAlumno) {
    this.alumnoSeleccionado = alumno; // cuando viene por output se actualiza
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
  setTomarAsistencias(evento: boolean) {
    this.cargando = true;
    this._asistenciaService
      .obtenerAsistenciasHoyPorPlanilla(this.planillaTaller, this.alumnos)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.cargando = false;
          datos.map((x: any) => {
            const index = this.alumnos.findIndex((i) => i._id === x.alumno);
            if (index !== -1) {
              this.alumnos[index].presente = x.presente;
              this.alumnos[index].tarde = x.llegoTarde;
            }
          });
          this.abrirModalParaTomarAsistencias();
        },
        (error) => {
          this.cargando = false;
          console.log('[ERROR]', error);
        }
      );
  }
  abrirModalParaTomarAsistencias() {
    const dialogRef = this._dialog.open(TomarAsistenciaModalComponent, {
      data: { isMobile: this.isMobile, planillaTaller: this.planillaTaller, alumnos: this.alumnos },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.alumnoSeleccionado = null;
        // this.setBuscarAsistenciaPorAlumno(this.alumnoSeleccionado);
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
    const dialogRef = this._dialog.open(AsistenciaFormModalComponent, {
      data: { asistencia: evento, planillaTaller: this.planillaTaller, alumno: this.alumnoSeleccionado },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.setBuscarAsistenciaPorAlumno(this.alumnoSeleccionado);
      }
    });
  }
  setEnviarEmail({ asistencia, faltas }) {
    const dialogRef = this._dialog.open(EmailAusenteModalComponent, {
      width: '50%',
      data: { asistencia, alumno: this.alumnoSeleccionado, faltas },
    });

    dialogRef.afterClosed().subscribe((result) => {});
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
    this.alumnoSeleccionado = alumno; // cuando viene por output se actualiza
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
      width: '30%',
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.setBuscarCalificacionesPorAlumno(this.alumnoSeleccionado);
      }
    });
  }
  setEditarCalificacion(evento: ICalificacion) {
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
      width: '30%',
    });

    dialogRef.afterClosed().subscribe((resultado) => {
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
      if (resultado) {
        this.resetTema++;
        this.obtenerClasesDetalle();
        // this.obtenerLibroDeTemas();
      }
    });
  }
  setEditarTema(tema: ITema) {
    const dialogRef = this._dialog.open(TemaFormModalComponent, {
      data: { planillaTaller: this.planillaTaller, tema: tema },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.obtenerClasesDetalle();
        this.resetTema++;
        // this.obtenerLibroDeTemas();
      }
    });
  }
  setEliminarTemas(temas: ITema[]) {
    Swal.fire({
      title: '¿Está seguro de continuar?',
      html: 'Está a punto de <strong>ELIMINAR PERMANENTEMENTE</strong> ' + temas.length + ' temas',
      icon: 'warning',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this._temaService.eliminarTemas(temas).pipe(
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
          this.obtenerClasesDetalle();
          this.resetTema++;
          //   this.obtenerLibroDeTemas();
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
          this.obtenerClasesDetalle();
          this.resetTema++;
          //   this.obtenerLibroDeTemas();
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
  setCargarLista(event) {
    this.resetTema++;
    this.obtenerClasesDetalle();
  }

  setBuscarSeguimientosPorAlumno(alumno: IAlumno) {
    this.alumnoSeleccionado = alumno; // cuando viene por output se actualiza
    this.cargandoSeguimiento = true;
    this._seguimientoAlumnoService
      .obtenerPorPlanillaYAlumno(this.planillaId, alumno._id)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.seguimientos = [...datos];
          this.cargandoSeguimiento = false;
        },
        (error) => {
          this.cargandoSeguimiento = false;
          console.log('[ERROR]', error);
        }
      );
  }
  //   Temas Incompletos
  obtenerTemasIncompletos() {
    this._temaService
      .obtenerTemasIncompletosPorPlanilla(this.planillaTaller._id)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.temasIncompletos = datos;
        },
        (error) => {
          console.log('[ERROR]', error);
        }
      );
  }
  // Temas Incompletos
  setInformarIncompletos(temas: ITema[]) {
    Swal.fire({
      title: '¿Está seguro de continuar?',
      html: 'Los temas seleccionados serán informados al profesor como temas a completar',
      icon: 'warning',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
        required: 'true',
        placeholder: 'Ingrese el motivo',
      },
      preConfirm: (motivoAlerta) => {
        const temasPendientes: ITemaPendiente[] = temas.map((x) => ({
          fecha: x.fecha,
          planillaTaller: x.planillaTaller,
          profesor: this.planillaTaller.profesor,
          motivoAlerta,
        }));
        return this._temaService.guardarTemasPendientes(temasPendientes).pipe(
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
      if (result.isConfirmed) {
        if (result.value && result.value.length > 0) {
          Swal.fire({
            title: 'Operación Exitosa',
            text: 'Los temas han sido guardados como pendiente. El profesor recibirá una alerta en los proximos minutos.',
            icon: 'success',
          });
        } else {
          Swal.fire({
            title: 'Oops! Ocurrió un error',
            text: 'No se han creado alertas de los temas pendientes. Si el problema persiste comuniquese con el soporte técnico.',
            icon: 'error',
          });
        }
      }
    });
  }
  setAbrirModalSeguimiento(evento) {
    if (!this.alumnoSeleccionado) {
      Swal.fire({
        title: 'Seleccione un alumno',
        text: 'Para gestionar el seguimiento debe seleccionar al alumno',
        icon: 'error',
      });
      return;
    }
    const dialogRef = this._dialog.open(SeguimientoFormModalComponent, {
      data: { planillaTaller: this.planillaTaller, alumno: this.alumnoSeleccionado },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.setBuscarSeguimientosPorAlumno(this.alumnoSeleccionado);
      }
    });
  }
  setEditarSeguimiento(seguimiento: ISeguimientoAlumno) {
    if (!this.alumnoSeleccionado) {
      Swal.fire({
        title: 'Seleccione un alumno',
        text: 'Para gestionar el seguimiento debe seleccionar al alumno',
        icon: 'error',
      });
      return;
    }
    if (!seguimiento) {
      Swal.fire({
        title: 'Seleccione el seguimiento del alumno',
        text: 'Para editar el seguimiento debe seleccionarla primero',
        icon: 'error',
      });
      return;
    }
    const dialogRef = this._dialog.open(SeguimientoFormModalComponent, {
      data: { planillaTaller: this.planillaTaller, seguimiento: seguimiento, alumno: this.alumnoSeleccionado },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.setBuscarSeguimientosPorAlumno(this.alumnoSeleccionado);
      }
    });
  }
  setEliminarSeguimiento(seguimiento: ISeguimientoAlumno) {
    Swal.fire({
      title: '¿Está seguro de continuar?',
      html: 'Está a punto de <strong>ELIMINAR PERMANENTEMENTE</strong> el seguimiento',
      icon: 'warning',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this._seguimientoAlumnoService.eliminarSeguimientoAlumno(seguimiento._id).pipe(
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
      if (result.isConfirmed) {
        if (result.value && result.value.status === 200) {
          Swal.fire({
            title: 'Operación Exitosa',
            text: 'El seguimiento ha sido actualizado correctamente.',
            icon: 'success',
          });
          this.setBuscarSeguimientosPorAlumno(this.alumnoSeleccionado);
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
  setPlanillaActualizada(evento) {
    // window.location.reload();

    this.calendario = this.temas = null;
    if (this.planillaTaller.curso) {
      if (!this.planillaTaller.personalizada) {
        this.obtenerAlumnosPorCursoEspecifico();
      } else {
        this.obtenerAlumnosPorPlanillaPersonalizada();
      }
    }
  }
}
