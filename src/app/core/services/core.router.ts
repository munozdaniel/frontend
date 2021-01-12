import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
const routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: 'src/app/features/home/home.module#HomeModule',
  },
  {
    path: 'autenticacion',
    loadChildren: 'src/app/features/autenticacion/autenticacion.module#AutenticacionRoutingModule',
  },
  {
    path: 'parametrizar',
    loadChildren: 'src/app/features/parametrizar/parametrizar.module#ParametrizarModule',
  },
  {
    path: 'taller',
    loadChildren: 'src/app/features/taller/taller.module#TallerModule',
  },
  {
    path: 'informes',
    loadChildren: 'src/app/features/informes/informes.module#InformesModule',
  },
  {
    path: 'administrar',
    loadChildren: 'src/app/features/administrar/administrar.module#AdministrarModule',
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
