import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MigrarComponent } from './containers/migrar/migrar.component';
import { DesignSharedModule } from '@design/shared.module';
import { SharedModule } from 'app/shared/shared.module';
import { AdministradorRoutingModule } from './administrador-routing.module';
import { CicloLectivoComponent } from './containers/ciclo-lectivo/ciclo-lectivo.component';
import { ActualizarAlumnosCicloComponent } from './ui/actualizar-alumnos-ciclo/actualizar-alumnos-ciclo.component';

@NgModule({
  declarations: [MigrarComponent, CicloLectivoComponent, ActualizarAlumnosCicloComponent],
  imports: [CommonModule, AdministradorRoutingModule, SharedModule, DesignSharedModule],
})
export class AdministradorModule {}
