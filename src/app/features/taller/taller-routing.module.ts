import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FichaAlumnosComponent } from './containers/ficha-alumnos/ficha-alumnos.component';
import { PlanillaAgregarComponent } from './containers/planilla-agregar/planilla-agregar.component';
import { PlanillaEditarComponent } from './containers/planilla-editar/planilla-editar.component';
import { PlanillaTallerAdministrarComponent } from './containers/planilla-taller-administrar/planilla-taller-administrar.component';
import { PlanillaVerComponent } from './containers/planilla-ver/planilla-ver.component';
import { PlanillasComponent } from './containers/planillas/planillas.component';
import { SeguimientoAgregarComponent } from './containers/seguimiento-agregar/seguimiento-agregar.component';
import { SeguimientoAlumnosComponent } from './containers/seguimiento-alumnos/seguimiento-alumnos.component';
import { SeguimientoEditarComponent } from './containers/seguimiento-editar/seguimiento-editar.component';
import { TomarAsistenciaComponent } from './containers/tomar-asistencia/tomar-asistencia.component';
import { AdministrarAsistenciasComponent } from './ui/administrar-asistencias/administrar-asistencias.component';

// taller
const routes: Routes = [
  {
    path: 'ficha-alumno',
    component: FichaAlumnosComponent,
    //  DEBE estar autenticados
  },
  {
    path: 'seguimiento-alumnos',
    component: SeguimientoAlumnosComponent,
    //  DEBE estar autenticados
  },
  {
    path: 'agregar-seguimiento',
    component: SeguimientoAgregarComponent,
    //  DEBE estar autenticados
  },
  {
    path: 'planillas',
    component: PlanillasComponent,
    //  DEBE estar autenticados
  },
  {
    path: 'planillas-agregar',
    component: PlanillaAgregarComponent,
    //  DEBE estar autenticados
  },
  {
    path: 'planillas-administrar/:id',
    component: PlanillaTallerAdministrarComponent,
    //  DEBE estar autenticados
  },
  {
    path: 'planillas-administrar/:id/:tipo',
    component: PlanillaTallerAdministrarComponent,
    //  DEBE estar autenticados
  },
  {
    path: 'planilla-ver/:id/:ciclo',
    component: PlanillaVerComponent,
    //  DEBE estar autenticados
  },
  //   INDIVIDUALES
  {
    path: 'seguimiento-edicion-single/:id',
    component: SeguimientoEditarComponent,
    //  DEBE estar autenticados
  },
  {
    path: 'tomar-asistencia/:id',
    component: TomarAsistenciaComponent,
    //  DEBE estar autenticados
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TallerRoutingModule {}
