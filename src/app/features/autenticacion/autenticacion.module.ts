import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IniciarSesionComponent } from './iniciar-sesion/iniciar-sesion.component';
import { RecuperarSesionComponent } from './recuperar-sesion/recuperar-sesion.component';
import { RegistrarComponent } from './registrar/registrar.component';
import { AutenticacionRoutingModule } from './autenticacion-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FuseSharedModule } from 'src/app/@fuse/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [IniciarSesionComponent, RecuperarSesionComponent, RegistrarComponent],
  imports: [CommonModule, ReactiveFormsModule, AutenticacionRoutingModule, SharedModule, FuseSharedModule],
})
export class AutenticacionModule {}
