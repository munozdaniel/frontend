import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AlumnosAgregarComponent } from './containers/alumnos-agregar/alumnos-agregar.component';
import { AlumnosEditarComponent } from './containers/alumnos-editar/alumnos-editar.component';
import { AlumnosComponent } from './containers/alumnos/alumnos.component';
import { AsignaturasAgregarComponent } from './containers/asignaturas-agregar/asignaturas-agregar.component';
import { AsignaturasEditarComponent } from './containers/asignaturas-editar/asignaturas-editar.component';
import { AsignaturasComponent } from './containers/asignaturas/asignaturas.component';

 // parametrizar/alumnos
const routes: Routes = [
    {
        path: "alumnos",
        component: AlumnosComponent,
        //  DEBE estar autenticados
    },
    {
        path: "alumnos-agregar",
        component: AlumnosAgregarComponent,
        //  DEBE estar autenticados
    },
    {
        path: "alumnos-editar/:id",
        component: AlumnosEditarComponent,
        //  DEBE estar autenticados
    },
    {
        path: "asignaturas",
        component: AsignaturasComponent,
        //  DEBE estar autenticados
    },
    {
        path: "asignaturas-agregar",
        component: AsignaturasAgregarComponent,
        //  DEBE estar autenticados
    },
    {
        path: "asignaturas-editar/:id",
        component: AsignaturasEditarComponent,
        //  DEBE estar autenticados
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ParametrizarRoutingModule {}
