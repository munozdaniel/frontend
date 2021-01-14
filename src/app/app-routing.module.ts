import { NgModule } from '@angular/core';
import { CoreModule } from '@angular/flex-layout';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';

import { CallbackComponent } from './features/callback/callback.component';
import { Error401Component } from './shared/errors/401/error-401.component';
import { Error404Component } from './shared/errors/404/error-404.component';
import { Error500Component } from './shared/errors/500/error-500.component';
//home
const routes: Routes = [
  {
    path: '',

    loadChildren: () => import('./core/core.module').then((m) => m.CoreModule),
  },
  {
    path: 'callback',
    component: CallbackComponent,
    //  DEBE estar autenticados
    canActivate: [AuthGuard],
  },
  { path: '401', component: Error401Component },
  { path: '404', component: Error404Component },
  { path: '500', component: Error500Component },
  { path: '**', redirectTo: '404' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
