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
import { PlanillaTallerTabsComponent } from './ui/planilla-taller-tabs/planilla-taller-tabs.component';
import { PlanillaVerComponent } from './containers/planilla-ver/planilla-ver.component';
import { PlanillaDetalleComponent } from './ui/planilla-detalle/planilla-detalle.component';
import { PlanillaDetalleAsistenciasComponent } from './ui/planilla-detalle-asistencias/planilla-detalle-asistencias.component';

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
    PlanillaTallerTabsComponent,
    PlanillaVerComponent,
    PlanillaDetalleComponent,
    PlanillaDetalleAsistenciasComponent,
  ],
  imports: [CommonModule, TallerRoutingModule, SharedModule, DesignSharedModule],
})
export class TallerModule {}
