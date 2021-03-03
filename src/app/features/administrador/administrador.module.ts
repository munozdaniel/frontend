import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MigrarComponent } from './containers/migrar/migrar.component';
import { DesignSharedModule } from '@design/shared.module';
import { SharedModule } from 'app/shared/shared.module';
import { AdministradorRoutingModule } from './administrador-routing.module';
import { CicloLectivoComponent } from './containers/ciclo-lectivo/ciclo-lectivo.component';

@NgModule({
  declarations: [MigrarComponent, CicloLectivoComponent],
  imports: [CommonModule, AdministradorRoutingModule, SharedModule, DesignSharedModule],
})
export class AdministradorModule {}
