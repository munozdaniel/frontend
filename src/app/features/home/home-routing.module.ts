import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "./containers/home/home.component";
import { TestComponent } from './containers/test/test.component';
//home
const routes: Routes = [
    {
        path: "",
        component: HomeComponent,
        //  DEBE estar autenticados
    },
    {
        path: "test",
        component: TestComponent,
        //  DEBE estar autenticados
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HomeRoutingModule {}
