import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MigrarComponent } from './containers/migrar/migrar.component';

// parametrizar/taller
const routes: Routes = [
  {
    path: 'migrar',
    component: MigrarComponent,
    //  DEBE estar autenticados
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministradorRoutingModule {}
