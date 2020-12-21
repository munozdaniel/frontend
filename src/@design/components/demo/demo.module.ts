import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

import { DesignDemoContentComponent } from './demo-content/demo-content.component';
import { DesignDemoSidebarComponent } from './demo-sidebar/demo-sidebar.component';

@NgModule({
    declarations: [
        DesignDemoContentComponent,
        DesignDemoSidebarComponent
    ],
    imports     : [
        RouterModule,

        MatDividerModule,
        MatListModule
    ],
    exports     : [
        DesignDemoContentComponent,
        DesignDemoSidebarComponent
    ]
})
export class DesignDemoModule
{
}
