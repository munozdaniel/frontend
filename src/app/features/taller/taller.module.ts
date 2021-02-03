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
  ],
  imports: [CommonModule, TallerRoutingModule, SharedModule, DesignSharedModule],
})
export class TallerModule {}
