import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DesignPipesModule } from '@design/pipes/pipes.module';

import { DesignMaterialColorPickerComponent } from '@design/components/material-color-picker/material-color-picker.component';

@NgModule({
    declarations: [
        DesignMaterialColorPickerComponent
    ],
    imports: [
        CommonModule,

        FlexLayoutModule,

        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatTooltipModule,

        DesignPipesModule
    ],
    exports: [
        DesignMaterialColorPickerComponent
    ],
})
export class DesignMaterialColorPickerModule
{
}
