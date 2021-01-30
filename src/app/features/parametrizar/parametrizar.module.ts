import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlumnosComponent } from './containers/alumnos/alumnos.component';
import { AsignaturasComponent } from './containers/asignaturas/asignaturas.component';
import { AlumnosMenuParamComponent } from './ui/alumnos-menu-param/alumnos-menu-param.component';
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
import { ComisionesComponent } from './containers/comisiones/comisiones.component';
import { ComisionesAgregarComponent } from './containers/comisiones-agregar/comisiones-agregar.component';
import { ComisionesEditarComponent } from './containers/comisiones-editar/comisiones-editar.component';
import { ComisionesVerComponent } from './containers/comisiones-ver/comisiones-ver.component';
import { ComisionesMenuParamComponent } from './ui/comisiones-menu-param/comisiones-menu-param.component';
import { ComisionesTablaParamComponent } from './ui/comisiones-tabla-param/comisiones-tabla-param.component';
import { ComisionesFormComponent } from './ui/comisiones-form/comisiones-form.component';
import { AlumnosVerUiComponent } from './ui/alumnos-ver-ui/alumnos-ver-ui.component';
import { AdultosFormComponent } from './ui/adultos-form/adultos-form.component';
import { AdultosTablaParamComponent } from './ui/adultos-table-param/adultos-tabla-param.component';

@NgModule({
  declarations: [
    AlumnosComponent,
    AsignaturasComponent,
    AlumnosMenuParamComponent,
    AlumnosFormComponent,
    AlumnosEditarComponent,
    AlumnosAgregarComponent,
    AsignaturasAgregarComponent,
    AsignaturasEditarComponent,
    AlumnosVerComponent,
    AsignaturasTablaParamComponent,
    AsignaturasMenuParamComponent,
    AsignaturasFormComponent,
    AsignaturasVerComponent,
    ProfesoresComponent,
    ProfesoresAgregarComponent,
    ProfesoresEditarComponent,
    ProfesoresVerComponent,
    ProfesoresFormComponent,
    ProfesoresTablaParamComponent,
    ProfesoresMenuParamComponent,
    AlumnosComisionesComponent,
    ComisionesComponent,
    ComisionesAgregarComponent,
    ComisionesEditarComponent,
    ComisionesVerComponent,
    ComisionesMenuParamComponent,
    ComisionesTablaParamComponent,
    ComisionesFormComponent,
    AlumnosVerUiComponent,
    AdultosFormComponent,
    AdultosTablaParamComponent,
  ],
  entryComponents: [ComisionesFormComponent, AdultosFormComponent],
  imports: [CommonModule, ParametrizarRoutingModule, SharedModule, DesignSharedModule],
})
export class ParametrizarModule {}
