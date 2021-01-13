import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { CallbackComponent } from './features/callback/callback.component';
//home
const routes: Routes = [
    {
        path: "callback",
        component: CallbackComponent,
        //  DEBE estar autenticados
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
