import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CicloLectivoComponent } from './containers/ciclo-lectivo/ciclo-lectivo.component';
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
    component: CicloLectivoComponent,
    //  DEBE estar autenticados
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministradorRoutingModule {}
