import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

// auth
const routes: Routes = [
  {
    path: 'iniciar-sesion',
    component: LoginComponent,
    //  DEBE estar autenticados
  },
  {
    path: 'registrar',
    component: RegisterComponent,
    //  DEBE estar autenticados
  },
  {
    path: 'forgot',
    component: ForgotPasswordComponent,
    //  DEBE estar autenticados
  },
  {
    path: 'reset/:id',
    component: ResetPasswordComponent,
    //  DEBE estar autenticados
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
