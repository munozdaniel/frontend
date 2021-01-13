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
    loadChildren: () => import('src/app/features/home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'autenticacion',
    loadChildren: () => import('src/app/features/autenticacion/autenticacion.module').then(m => m.AutenticacionRoutingModule),
  },
  {
    path: 'parametrizar',
    loadChildren: () => import('src/app/features/parametrizar/parametrizar.module').then(m => m.ParametrizarModule),
  },
  {
    path: 'taller',
    loadChildren: () => import('src/app/features/taller/taller.module').then(m => m.TallerModule),
  },
  {
    path: 'informes',
    loadChildren: () => import('src/app/features/informes/informes.module').then(m => m.InformesModule),
  },
  {
    path: 'administrar',
    loadChildren: () => import('src/app/features/administrar/administrar.module').then(m => m.AdministrarModule),
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
