import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AlumnosAgregarComponent } from './containers/alumnos-agregar/alumnos-agregar.component';
import { AlumnosEditarComponent } from './containers/alumnos-editar/alumnos-editar.component';
import { AlumnosVerComponent } from './containers/alumnos-ver/alumnos-ver.component';
import { AlumnosComponent } from './containers/alumnos/alumnos.component';
import { AsignaturasAgregarComponent } from './containers/asignaturas-agregar/asignaturas-agregar.component';
import { AsignaturasEditarComponent } from './containers/asignaturas-editar/asignaturas-editar.component';
import { AsignaturasVerComponent } from './containers/asignaturas-ver/asignaturas-ver.component';
import { AsignaturasComponent } from './containers/asignaturas/asignaturas.component';
import { ComisionesAgregarComponent } from './containers/comisiones-agregar/comisiones-agregar.component';
import { ComisionesEditarComponent } from './containers/comisiones-editar/comisiones-editar.component';
import { ComisionesVerComponent } from './containers/comisiones-ver/comisiones-ver.component';
import { ComisionesComponent } from './containers/comisiones/comisiones.component';
import { ImportarAlumnosComponent } from "./containers/importar-alumnos/importar-alumnos.component";
import { ProfesoresAgregarComponent } from './containers/profesores-agregar/profesores-agregar.component';
import { ProfesoresEditarComponent } from './containers/profesores-editar/profesores-editar.component';
import { ProfesoresVerComponent } from './containers/profesores-ver/profesores-ver.component';
import { ProfesoresComponent } from './containers/profesores/profesores.component';

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
        path: "alumnos-ver/:id",
        component: AlumnosVerComponent,
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
    {
        path: "asignaturas-ver/:id",
        component: AsignaturasVerComponent,
        //  DEBE estar autenticados
    },
    {
        path: "profesores",
        component: ProfesoresComponent,
        //  DEBE estar autenticados
    },
    {
        path: "profesores-agregar",
        component: ProfesoresAgregarComponent,
        //  DEBE estar autenticados
    },
    {
        path: "profesores-editar/:id",
        component: ProfesoresEditarComponent,
        //  DEBE estar autenticados
    },
    {
        path: "profesores-ver/:id",
        component: ProfesoresVerComponent,
        //  DEBE estar autenticados
    }, 
    {
        path: "comisiones",
        component: ComisionesComponent,
        //  DEBE estar autenticados
    },
    {
        path: "comisiones-agregar",
        component: ComisionesAgregarComponent,
        //  DEBE estar autenticados
    },
    {
        path: "comisiones-editar/:id",
        component: ComisionesEditarComponent,
        //  DEBE estar autenticados
    },
    {
        path: "comisiones-ver/:id",
        component:ComisionesVerComponent,
        //  DEBE estar autenticados
    },
    {
        path: "importar-alumnos",
        component:ImportarAlumnosComponent,
        //  DEBE estar autenticados
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ParametrizarRoutingModule {}
