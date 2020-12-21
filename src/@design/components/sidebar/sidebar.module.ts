import { NgModule } from '@angular/core';

import { DesignSidebarComponent } from './sidebar.component';

@NgModule({
    declarations: [
        DesignSidebarComponent
    ],
    exports     : [
        DesignSidebarComponent
    ]
})
export class DesignSidebarModule
{
}
