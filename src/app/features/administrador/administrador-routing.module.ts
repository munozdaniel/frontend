import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActualizarCicloLectivoComponent } from './containers/actualizar-ciclo-lectivo/actualizar-ciclo-lectivo.component';
import { MigrarComponent } from './containers/migrar/migrar.component';

// administrador/migrar
const routes: Routes = [
  {
    path: 'migrar',
    component: MigrarComponent,
    //  DEBE estar autenticados
  },
  {
    path: 'ciclo-lectivo',
    component: ActualizarCicloLectivoComponent,
    //  DEBE estar autenticados
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministradorRoutingModule {}
