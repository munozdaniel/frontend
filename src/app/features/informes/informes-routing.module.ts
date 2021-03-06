import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlumnosPorTallerComponent } from './containers/alumnos-por-taller/alumnos-por-taller.component';
import { AsistenciaPorDiaComponent } from './containers/asistencia-por-dia/asistencia-por-dia.component';
import { AsistenciaPorTallerComponent } from './containers/asistencia-por-taller/asistencia-por-taller.component';
import { CalificacionesPorTallerResumenComponent } from './containers/calificaciones-por-taller-resumen/calificaciones-por-taller-resumen.component';
import { CalificacionesPorTallerComponent } from './containers/calificaciones-por-taller/calificaciones-por-taller.component';
import { InasistenciaDiariaComponent } from './containers/inasistencia-diaria/inasistencia-diaria.component';
import { InasistenciaSemanalComponent } from './containers/inasistencia-semanal/inasistencia-semanal.component';
import { LibroTemasComponent } from './containers/libro-temas/libro-temas.component';
import { TallerPorAlumnosTutoresComponent } from './containers/taller-por-alumnos-tutores/taller-por-alumnos-tutores.component';

// auth
const routes: Routes = [
  {
    path: 'asistencia-por-taller',
    component: AsistenciaPorTallerComponent,
    //  DEBE estar autenticados
  },
  {
    path: 'asistencia-por-dia',
    component: AsistenciaPorDiaComponent,
    //  DEBE estar autenticados
  },
  {
    path: 'calificaciones-por-taller',
    component: CalificacionesPorTallerComponent,
    //  DEBE estar autenticados
  },
  {
    path: 'calificaciones-por-taller-resumen',
    component: CalificacionesPorTallerResumenComponent,
    //  DEBE estar autenticados
  },
  {
    path: 'libro-temas',
    component: LibroTemasComponent,
    //  DEBE estar autenticados
  },
  {
    path: 'alumnos-por-taller',
    component: AlumnosPorTallerComponent,
    //  DEBE estar autenticados
  },
  {
    path: 'taller-por-alumnos-tutores',
    component: TallerPorAlumnosTutoresComponent,
    //  DEBE estar autenticados
  },
  {
    path: 'inasistencias-diarias',
    component: InasistenciaDiariaComponent,
    //  DEBE estar autenticados
  },
  {
    path: 'inasistencias-semanal',
    component: InasistenciaSemanalComponent,
    //  DEBE estar autenticados
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InformesRoutingModule {}
