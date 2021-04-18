import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { Error401Component } from './errors/401/error-401.component';
import { Error404Component } from './errors/404/error-404.component';
import { Error500Component } from './errors/500/error-500.component';
import { RouterModule } from '@angular/router';
import { GhostsComponent } from './components/ghosts/ghosts.component';
import { EmptyDataComponent } from './components/empty-data/empty-data.component';
import { VolverComponent } from './volver/volver.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AlumnosTablaParamComponent } from './components/alumnos-tabla-param/alumnos-tabla-param.component';
import { FormCicloLectivoComponent } from './components/form-ciclo-lectivo/form-ciclo-lectivo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputAutocompleteComponent } from './components/input-autocomplete/input-autocomplete.component';
import { AlumnoDatosPdfComponent } from './components/alumno-datos-pdf/alumno-datos-pdf.component';
import { EmailAusenteModalComponent } from './components/email-ausente-modal/email-ausente-modal.component';
import { BuscarPlanillaFormComponent } from './components/buscar-planilla-form/buscar-planilla-form.component';
import { PlanillaTablaSimpleComponent } from './components/planilla-tabla-simple/planilla-tabla-simple.component';
import { AgregarCursadaComponent } from './components/agregar-cursada/agregar-cursada.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule.withConfig({
      useColumnBasisZero: false,
      printWithBreakpoints: ['md', 'lt-lg', 'lt-xl', 'gt-sm', 'gt-xs'],
    }),
  ],
  providers: [],
  entryComponents: [],
  exports: [
    Error401Component,
    Error404Component,
    Error500Component,
    MaterialModule,
    GhostsComponent,
    EmptyDataComponent,
    VolverComponent,
    AlumnosTablaParamComponent,
    FormCicloLectivoComponent,
    InputAutocompleteComponent,
    AlumnoDatosPdfComponent,
    BuscarPlanillaFormComponent,
    PlanillaTablaSimpleComponent,
    AgregarCursadaComponent,
  ],
  declarations: [
    Error401Component,
    Error404Component,
    Error500Component,
    GhostsComponent,
    EmptyDataComponent,
    VolverComponent,
    AlumnosTablaParamComponent,
    FormCicloLectivoComponent,
    InputAutocompleteComponent,
    AlumnoDatosPdfComponent,
    EmailAusenteModalComponent,
    BuscarPlanillaFormComponent,
    PlanillaTablaSimpleComponent,
    AgregarCursadaComponent,
  ],
})
export class SharedModule {}
