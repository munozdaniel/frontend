import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DesignSharedModule } from '@design/shared.module';

import { ContentComponent } from 'app/layout/components/content/content.component';

@NgModule({
    declarations: [
        ContentComponent
    ],
    imports     : [
        RouterModule,
        DesignSharedModule
    ],
    exports     : [
        ContentComponent
    ]
})
export class ContentModule
{
}
