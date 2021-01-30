import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FichaAlumnosComponent } from './containers/ficha-alumnos/ficha-alumnos.component';

// parametrizar/taller
const routes: Routes = [
  {
    path: 'ficha-alumno',
    component: FichaAlumnosComponent,
    //  DEBE estar autenticados
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TallerRoutingModule {}
