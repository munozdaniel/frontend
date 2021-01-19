import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlumnosComponent } from './containers/alumnos/alumnos.component';
import { AsignaturasComponent } from './containers/asignaturas/asignaturas.component';
import { AlumnosMenuParamComponent } from './ui/alumnos-menu-param/alumnos-menu-param.component';
import { AlumnosTablaParamComponent } from './ui/alumnos-tabla-param/alumnos-tabla-param.component';
import { AlumnosFormComponent } from './ui/alumnos-form/alumnos-form.component';
import { AlumnosEditarComponent } from './containers/alumnos-editar/alumnos-editar.component';
import { AlumnosAgregarComponent } from './containers/alumnos-agregar/alumnos-agregar.component';
import { AsignaturasAgregarComponent } from './containers/asignaturas-agregar/asignaturas-agregar.component';
import { AsignaturasEditarComponent } from './containers/asignaturas-editar/asignaturas-editar.component';
import { ParametrizarRoutingModule } from './parametrizar-routing.module';
import { DesignSharedModule } from '@design/shared.module';
import { SharedModule } from 'app/shared/shared.module';
import { AlumnosVerComponent } from './containers/alumnos-ver/alumnos-ver.component';
import { AsignaturasTablaParamComponent } from './ui/asignaturas-tabla-param/asignaturas-tabla-param.component';
import { AsignaturasMenuParamComponent } from './ui/asignaturas-menu-param/asignaturas-menu-param.component';
import { AsignaturasFormComponent } from './ui/asignaturas-form/asignaturas-form.component';
import { AsignaturasVerComponent } from './containers/asignaturas-ver/asignaturas-ver.component';

@NgModule({
  declarations: [
    AlumnosComponent,
    AsignaturasComponent,
    AlumnosMenuParamComponent,
    AlumnosTablaParamComponent,
    AlumnosFormComponent,
    AlumnosEditarComponent,
    AlumnosAgregarComponent,
    AsignaturasAgregarComponent,
    AsignaturasEditarComponent,AlumnosVerComponent, AsignaturasTablaParamComponent, AsignaturasMenuParamComponent, AsignaturasFormComponent, AsignaturasVerComponent
  ],
  imports: [CommonModule, ParametrizarRoutingModule, SharedModule, DesignSharedModule],
})
export class ParametrizarModule {}
