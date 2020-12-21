import { NgModule } from '@angular/core';

import { DesignIfOnDomDirective } from '@design/directives/design-if-on-dom/design-if-on-dom.directive';
import { DesignInnerScrollDirective } from '@design/directives/design-inner-scroll/design-inner-scroll.directive';
import { DesignPerfectScrollbarDirective } from '@design/directives/design-perfect-scrollbar/design-perfect-scrollbar.directive';
import { DesignMatSidenavHelperDirective, DesignMatSidenavTogglerDirective } from '@design/directives/design-mat-sidenav/design-mat-sidenav.directive';

@NgModule({
    declarations: [
        DesignIfOnDomDirective,
        DesignInnerScrollDirective,
        DesignMatSidenavHelperDirective,
        DesignMatSidenavTogglerDirective,
        DesignPerfectScrollbarDirective
    ],
    imports     : [],
    exports     : [
        DesignIfOnDomDirective,
        DesignInnerScrollDirective,
        DesignMatSidenavHelperDirective,
        DesignMatSidenavTogglerDirective,
        DesignPerfectScrollbarDirective
    ]
})
export class DesignDirectivesModule
{
}
