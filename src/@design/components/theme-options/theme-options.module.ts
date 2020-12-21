import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { DesignDirectivesModule } from '@design/directives/directives';
import { DesignMaterialColorPickerModule } from '@design/components/material-color-picker/material-color-picker.module';
import { DesignSidebarModule } from '@design/components/sidebar/sidebar.module';

import { DesignThemeOptionsComponent } from '@design/components/theme-options/theme-options.component';

@NgModule({
    declarations: [
        DesignThemeOptionsComponent
    ],
    imports     : [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        FlexLayoutModule,

        MatButtonModule,
        MatCheckboxModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatOptionModule,
        MatRadioModule,
        MatSelectModule,
        MatSlideToggleModule,

        DesignDirectivesModule,
        DesignMaterialColorPickerModule,
        DesignSidebarModule
    ],
    exports     : [
        DesignThemeOptionsComponent
    ]
})
export class DesignThemeOptionsModule
{
}
