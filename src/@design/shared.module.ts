import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';

import { DesignDirectivesModule } from '@design/directives/directives';
import { DesignPipesModule } from '@design/pipes/pipes.module';

@NgModule({
    imports  : [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        FlexLayoutModule,

        DesignDirectivesModule,
        DesignPipesModule
    ],
    exports  : [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        FlexLayoutModule,

        DesignDirectivesModule,
        DesignPipesModule
    ]
})
export class DesignSharedModule
{
}
