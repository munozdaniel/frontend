import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignSharedModule } from '@design/shared.module';
import { BuscarCursoFormComponent } from './ui/buscar-curso-form/buscar-curso-form.component';
import { LiteRoutingModule } from './lite-routing.module';
import { AlumnosTablaAsistenciasComponent } from './ui/alumnos-tabla-asistencias/alumnos-tabla-asistencias.component';
import { TomarAsistenciasComponent } from './containers/tomar-asistencias/tomar-asistencias.component';
import { SharedModule } from 'app/shared/shared.module';
import { PlanillasModalComponent } from './ui/planillas-modal/planillas-modal.component';

@NgModule({
  declarations: [TomarAsistenciasComponent, BuscarCursoFormComponent, AlumnosTablaAsistenciasComponent, PlanillasModalComponent],
  imports: [CommonModule, LiteRoutingModule, DesignSharedModule, SharedModule],
})
export class LiteModule {}
