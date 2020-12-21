import { NgModule } from '@angular/core';

import { DesignWidgetComponent } from './widget.component';
import { DesignWidgetToggleDirective } from './widget-toggle.directive';

@NgModule({
    declarations: [
        DesignWidgetComponent,
        DesignWidgetToggleDirective
    ],
    exports     : [
        DesignWidgetComponent,
        DesignWidgetToggleDirective
    ],
})
export class DesignWidgetModule
{
}
