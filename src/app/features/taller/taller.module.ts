
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignSharedModule } from '@design/shared.module';
import { SharedModule } from 'app/shared/shared.module';
import { TallerRoutingModule } from './taller-routing.module';
import { FichaAlumnosComponent } from './containers/ficha-alumnos/ficha-alumnos.component';
import { FormBusquedaAlumnosComponent } from './ui/form-busqueda-alumnos/form-busqueda-alumnos.component';
import { SeguimientoAlumnosComponent } from './containers/seguimiento-alumnos/seguimiento-alumnos.component';
import { TipoSeguimientoFormComponent } from './ui/tipo-seguimiento-form/tipo-seguimiento-form.component';
import { SeguimientoAlumnosTablaComponent } from './ui/seguimiento-alumnos-tabla/seguimiento-alumnos-tabla.component';
import { SeguimientoAgregarComponent } from './containers/seguimiento-agregar/seguimiento-agregar.component';
import { SeguimientoAlumnoFormComponent } from './ui/seguimiento-alumno-form/seguimiento-alumno-form.component';
import { SeguimientoBusquedaAlumnoComponent } from './ui/seguimiento-busqueda-alumno/seguimiento-busqueda-alumno.component';
import { PlanillasComponent } from './containers/planillas/planillas.component';
import { PlanillasTablaComponent } from './ui/planillas-tabla/planillas-tabla.component';
import { PlanillaAgregarComponent } from './containers/planilla-agregar/planilla-agregar.component';
import { PlanillaFormComponent } from './ui/planilla-form/planilla-form.component';
import { PlanillaEditarComponent } from './containers/planilla-editar/planilla-editar.component';
import { PlanillaStepperComponent } from './ui/planilla-stepper/planilla-stepper.component';
import { PlanillaVerComponent } from './containers/planilla-ver/planilla-ver.component';
import { PlanillaDetalleAsistenciasComponent } from './ui/planilla-detalle-asistencias/planilla-detalle-asistencias.component';
import { PlanillaDetalleGeneralComponent } from './ui/planilla-detalle/planilla-detalle-general.component';
import { PlanillaDetalleCalificacionesComponent } from './ui/planilla-detalle-calificaciones/planilla-detalle-calificaciones.component';
import { PlanillaDetalleTemasComponent } from './ui/planilla-detalle-temas/planilla-detalle-temas.component';
import { PlanillaDetalleSeguimientoComponent } from './ui/planilla-detalle-seguimiento/planilla-detalle-seguimiento.component';
import { TablaAlumnosComponent } from './ui/tabla-alumnos/tabla-alumnos.component';
import { VerSeguimientoModalComponent } from './ui/ver-seguimiento-modal/ver-seguimiento-modal.component';
import { PlanillaDetalleInformesComponent } from './ui/planilla-detalle-informes/planilla-detalle-informes.component';
import { PlanillaTallerAdministrarComponent } from './containers/planilla-taller-administrar/planilla-taller-administrar.component';
import { AdministrarAsistenciasComponent } from './ui/administrar-asistencias/administrar-asistencias.component';
import { TomarAsistenciaComponent } from './containers/tomar-asistencia/tomar-asistencia.component';
import { AsistenciaFormModalComponent } from './containers/asistencia-form-modal/asistencia-form-modal.component';
import { CalificacionFormModalComponent } from './containers/calificacion-form-modal/calificacion-form-modal.component';
import { TemaFormModalComponent } from './containers/tema-form-modal/tema-form-modal.component';
import { SeguimientoFormModalComponent } from './containers/seguimiento-form-modal/seguimiento-form-modal.component';
import { SeguimientoEditarComponent } from './containers/seguimiento-editar/seguimiento-editar.component';
import { SeguimientoFormComponent } from './ui/seguimiento-form/seguimiento-form.component';
import { FichaAlumnoDetalleComponent } from './containers/ficha-alumno-detalle/ficha-alumno-detalle.component';
import { InformesComponent } from './containers/informes/informes.component';
import { InasistenciasAlumnosComponent } from './containers/inasistencias-alumnos/inasistencias-alumnos.component';
import { PlanillaCalendarioComponent } from './ui/planilla-calendario/planilla-calendario.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { AdministradorModule, momentAdapterFactory } from '../administrador/administrador.module';
import { CustomPlanillaAlumnosModalComponent } from './containers/custom-planilla-alumnos-modal/custom-planilla-alumnos-modal.component';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  declarations: [
    FichaAlumnosComponent,
    FormBusquedaAlumnosComponent,
    SeguimientoAlumnosComponent,
    TipoSeguimientoFormComponent,
    SeguimientoAlumnosTablaComponent,
    SeguimientoAgregarComponent,
    SeguimientoAlumnoFormComponent,
    SeguimientoBusquedaAlumnoComponent,
    PlanillasComponent,
    PlanillasTablaComponent,
    PlanillaAgregarComponent,
    PlanillaFormComponent,
    PlanillaEditarComponent,
    PlanillaStepperComponent,
    PlanillaVerComponent,
    PlanillaDetalleGeneralComponent,
    PlanillaDetalleAsistenciasComponent,
    PlanillaDetalleCalificacionesComponent,
    PlanillaDetalleTemasComponent,
    PlanillaDetalleSeguimientoComponent,
    TablaAlumnosComponent,
    VerSeguimientoModalComponent,
    PlanillaDetalleInformesComponent,
    PlanillaTallerAdministrarComponent,
    AdministrarAsistenciasComponent,
    TomarAsistenciaComponent,
    AsistenciaFormModalComponent,
    CalificacionFormModalComponent,
    TemaFormModalComponent,
    SeguimientoFormModalComponent,
    SeguimientoEditarComponent,
    SeguimientoFormComponent,
    FichaAlumnoDetalleComponent,
    InformesComponent,
    InasistenciasAlumnosComponent,
    PlanillaCalendarioComponent,
    CustomPlanillaAlumnosModalComponent,
  ],
  imports: [
    CommonModule,
    TallerRoutingModule,
    SharedModule,
    DesignSharedModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: momentAdapterFactory }),
    AdministradorModule,
    NgxPermissionsModule.forChild(),
  ],
  entryComponents: [CustomPlanillaAlumnosModalComponent],
})
export class TallerModule {}
