import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsistenciaPorTallerComponent } from './containers/asistencia-por-taller/asistencia-por-taller.component';
import { AsistenciaPorDiaComponent } from './containers/asistencia-por-dia/asistencia-por-dia.component';
import { CalificacionesPorTallerComponent } from './containers/calificaciones-por-taller/calificaciones-por-taller.component';
import { CalificacionesPorTallerResumenComponent } from './containers/calificaciones-por-taller-resumen/calificaciones-por-taller-resumen.component';
import { LibroTemasComponent } from './containers/libro-temas/libro-temas.component';
import { AlumnosPorTallerComponent } from './containers/alumnos-por-taller/alumnos-por-taller.component';
import { TallerPorAlumnosTutoresComponent } from './containers/taller-por-alumnos-tutores/taller-por-alumnos-tutores.component';
import { DesignSharedModule } from '@design/shared.module';
import { SharedModule } from 'app/shared/shared.module';
import { InformesRoutingModule } from './informes-routing.module';
import { AsistenciasPorFechaComponent } from './containers/asistencias-por-fecha/asistencias-por-fecha.component';

@NgModule({
  declarations: [
    AsistenciaPorTallerComponent,
    AsistenciaPorDiaComponent,
    CalificacionesPorTallerComponent,
    CalificacionesPorTallerResumenComponent,
    LibroTemasComponent,
    AlumnosPorTallerComponent,
    TallerPorAlumnosTutoresComponent,
    AsistenciasPorFechaComponent,
  ],
  imports: [CommonModule, InformesRoutingModule, SharedModule, DesignSharedModule],
})
export class InformesModule {}
