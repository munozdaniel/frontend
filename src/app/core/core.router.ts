import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
const routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () => import('../features/home/home.module').then((m) => m.HomeModule),
    canActivate: [AuthGuard],
  },
  // {
  //     path: "autenticacion",
  //     loadChildren: () =>
  //         import("../features/autenticacion/autenticacion.module").then(
  //             (m) => m.AutenticacionRoutingModule
  //         ),
  //     canActivate: [AuthGuard],
  // },
  {
    path: 'parametrizar',
    loadChildren: () => import('../features/parametrizar/parametrizar.module').then((m) => m.ParametrizarModule),
    // canActivate: [AuthGuard],
  },
  {
    path: 'taller',
    loadChildren: () => import('../features/taller/taller.module').then((m) => m.TallerModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'informes',
    loadChildren: () => import('../features/informes/informes.module').then((m) => m.InformesModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'administrador',
    loadChildren: () => import('../features/administrador/administrador.module').then((m) => m.AdministradorModule),
    canActivate: [AuthGuard],
  },
  // {
  //     path: "administrar",
  //     loadChildren: () =>
  //         import("../features/administrar/administrar.module").then(
  //             (m) => m.AdministrarModule
  //         ),
  //     canActivate: [AuthGuard],
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
