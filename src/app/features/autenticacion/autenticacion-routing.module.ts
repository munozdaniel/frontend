import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IniciarSesionComponent } from './iniciar-sesion/iniciar-sesion.component';
import { RegistrarComponent } from './registrar/registrar.component';
import { RecuperarSesionComponent } from './recuperar-sesion/recuperar-sesion.component';
//autenticacion/iniciar-sesion
const routes: Routes = [
  {
    path: 'iniciar-sesion',
    component: IniciarSesionComponent,
    // NO DEBE estar autenticados
  },
  {
    path: 'iniciar-sesion/:error',
    component: IniciarSesionComponent,
    // NO DEBE estar autenticados
  },
  {
    path: 'recuperar-sesion',
    component: RecuperarSesionComponent,
    // NO DEBE estar autenticados
  },
  {
    path: 'registrar',
    component: RegistrarComponent,
    // NO DEBE estar autenticados
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AutenticacionRoutingModule {}
