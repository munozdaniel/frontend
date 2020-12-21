import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { DesignSearchBarComponent } from './search-bar.component';

@NgModule({
    declarations: [
        DesignSearchBarComponent
    ],
    imports     : [
        CommonModule,
        RouterModule,

        MatButtonModule,
        MatIconModule
    ],
    exports     : [
        DesignSearchBarComponent
    ]
})
export class DesignSearchBarModule
{
}
