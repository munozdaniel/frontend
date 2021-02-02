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
import { EmailUnverifiedComponent } from './components/email-unverified/email-unverified.component';
import { AlumnosTablaParamComponent } from './components/alumnos-tabla-param/alumnos-tabla-param.component';
import { FormCicloLectivoComponent } from './components/form-ciclo-lectivo/form-ciclo-lectivo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    EmailUnverifiedComponent,
    AlumnosTablaParamComponent,
    FormCicloLectivoComponent,
  ],
  declarations: [
    Error401Component,
    Error404Component,
    Error500Component,
    GhostsComponent,
    EmptyDataComponent,
    VolverComponent,
    EmailUnverifiedComponent,
    AlumnosTablaParamComponent,
    FormCicloLectivoComponent,
  ],
})
export class SharedModule {}
