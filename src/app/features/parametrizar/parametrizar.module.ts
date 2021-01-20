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
import { ProfesoresComponent } from './containers/profesores/profesores.component';
import { ProfesoresAgregarComponent } from './containers/profesores-agregar/profesores-agregar.component';
import { ProfesoresEditarComponent } from './containers/profesores-editar/profesores-editar.component';
import { ProfesoresVerComponent } from './containers/profesores-ver/profesores-ver.component';
import { ProfesoresFormComponent } from './ui/profesores-form/profesores-form.component';
import { ProfesoresTablaParamComponent } from './ui/profesores-tabla-param/profesores-tabla-param.component';
import { ProfesoresMenuParamComponent } from './ui/profesores-menu-param/profesores-menu-param.component';
import { AlumnosComisionesComponent } from './ui/alumnos-comisiones/alumnos-comisiones.component';

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
    AsignaturasEditarComponent,AlumnosVerComponent, AsignaturasTablaParamComponent, AsignaturasMenuParamComponent, AsignaturasFormComponent, AsignaturasVerComponent, ProfesoresComponent, ProfesoresAgregarComponent, ProfesoresEditarComponent, ProfesoresVerComponent, ProfesoresFormComponent, ProfesoresTablaParamComponent, ProfesoresMenuParamComponent, AlumnosComisionesComponent
  ],
  imports: [CommonModule, ParametrizarRoutingModule, SharedModule, DesignSharedModule],
})
export class ParametrizarModule {}
