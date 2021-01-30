import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignSharedModule } from '@design/shared.module';
import { SharedModule } from 'app/shared/shared.module';
import { TallerRoutingModule } from './taller-routing.module';
import { FichaAlumnosComponent } from './containers/ficha-alumnos/ficha-alumnos.component';
import { FormBusquedaAlumnosComponent } from './ui/form-busqueda-alumnos/form-busqueda-alumnos.component';

@NgModule({
  declarations: [
    FichaAlumnosComponent,
    FormBusquedaAlumnosComponent,
  ],
  imports: [CommonModule, TallerRoutingModule, SharedModule, DesignSharedModule],
})
export class TallerModule {}
