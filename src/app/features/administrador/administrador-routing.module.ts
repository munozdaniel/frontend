import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActualizarCicloLectivoComponent } from './containers/actualizar-ciclo-lectivo/actualizar-ciclo-lectivo.component';
import { CalendarioAcademicoComponent } from './containers/calendario-academico/calendario-academico.component';
import { MigrarComponent } from './containers/migrar/migrar.component';
import { RolesComponent } from './containers/roles/roles.component';

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
  {
    path: 'calendario-academico',
    component: CalendarioAcademicoComponent,
    //  DEBE estar autenticados
  },
  {
    path: 'usuarios-roles',
    component: RolesComponent,
    //  DEBE estar autenticados
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministradorRoutingModule {}
