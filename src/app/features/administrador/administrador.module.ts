import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MigrarComponent } from './containers/migrar/migrar.component';
import { DesignSharedModule } from '@design/shared.module';
import { SharedModule } from 'app/shared/shared.module';
import { AdministradorRoutingModule } from './administrador-routing.module';
import { ActualizarAlumnosCicloComponent } from './ui/actualizar-alumnos-ciclo/actualizar-alumnos-ciclo.component';
import { ActualizarCicloLectivoComponent } from './containers/actualizar-ciclo-lectivo/actualizar-ciclo-lectivo.component';
import { ResultadoCicloTablaComponent } from './ui/resultado-ciclo-tabla/resultado-ciclo-tabla.component';
import { CalendarioAcademicoComponent } from './containers/calendario-academico/calendario-academico.component';
import { CalendarioDatosComponent } from './ui/calendario-datos/calendario-datos.component';
import { RolesComponent } from './containers/roles/roles.component';
import { UsuariosTablaComponent } from './ui/usuarios-tabla/usuarios-tabla.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import * as moment from 'moment';
import { CalendarHeaderComponent } from './ui/calendar-header/calendar-header.component';
import { AlumnosEliminadosComponent } from './containers/alumnos-eliminados/alumnos-eliminados.component';
import { NgxPermissionsModule } from 'ngx-permissions';

export function momentAdapterFactory() {
  return adapterFactory(moment);
}
@NgModule({
  declarations: [
    MigrarComponent,
    ActualizarCicloLectivoComponent,
    ActualizarAlumnosCicloComponent,
    ResultadoCicloTablaComponent,
    CalendarioAcademicoComponent,
    CalendarioDatosComponent,
    RolesComponent,
    UsuariosTablaComponent,
    CalendarHeaderComponent,
    AlumnosEliminadosComponent,
  ],
  imports: [
    CommonModule,
    AdministradorRoutingModule,
    SharedModule,
    DesignSharedModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: momentAdapterFactory }),
    NgxPermissionsModule.forChild(),
  ],
  exports: [CalendarHeaderComponent],
})
export class AdministradorModule {}
