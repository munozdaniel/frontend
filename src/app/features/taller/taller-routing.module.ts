import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FichaAlumnosComponent } from './containers/ficha-alumnos/ficha-alumnos.component';
import { PlanillasComponent } from './containers/planillas/planillas.component';
import { SeguimientoAgregarComponent } from './containers/seguimiento-agregar/seguimiento-agregar.component';
import { SeguimientoAlumnosComponent } from './containers/seguimiento-alumnos/seguimiento-alumnos.component';

// parametrizar/taller
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
    component: PlanillasComponent,
    //  DEBE estar autenticados
  },
  {
    path: 'planillas-editar/:id',
    component: PlanillasComponent,
    //  DEBE estar autenticados
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TallerRoutingModule {}
