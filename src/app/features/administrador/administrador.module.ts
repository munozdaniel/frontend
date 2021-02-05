import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MigrarComponent } from './containers/migrar/migrar.component';
import { DesignSharedModule } from '@design/shared.module';
import { SharedModule } from 'app/shared/shared.module';
import { AdministradorRoutingModule } from './administrador-routing.module';

@NgModule({
  declarations: [MigrarComponent],
  imports: [CommonModule, AdministradorRoutingModule, SharedModule, DesignSharedModule],
})
export class AdministradorModule {}