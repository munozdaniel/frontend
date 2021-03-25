import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TomarAsistenciasComponent } from './containers/tomar-asistencias/tomar-asistencias.component';

// auth
const routes: Routes = [
  {
    path: 'tomar-asistencia',
    component: TomarAsistenciasComponent,
    //  DEBE estar autenticados
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LiteRoutingModule {}
