import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { CallbackComponent } from './features/callback/callback.component';
import { Error401Component } from './shared/errors/401/error-401.component';
import { Error404Component } from './shared/errors/404/error-404.component';
import { Error500Component } from './shared/errors/500/error-500.component';
//home
const routes: Routes = [
    {
        path: "callback",
        component: CallbackComponent,
        //  DEBE estar autenticados
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
