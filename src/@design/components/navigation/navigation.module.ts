import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from '@ngx-translate/core';

import { DesignNavigationComponent } from './navigation.component';
import { DesignNavVerticalItemComponent } from './vertical/item/item.component';
import { DesignNavVerticalCollapsableComponent } from './vertical/collapsable/collapsable.component';
import { DesignNavVerticalGroupComponent } from './vertical/group/group.component';
import { DesignNavHorizontalItemComponent } from './horizontal/item/item.component';
import { DesignNavHorizontalCollapsableComponent } from './horizontal/collapsable/collapsable.component';

@NgModule({
    imports     : [
        CommonModule,
        RouterModule,

        MatIconModule,
        MatRippleModule,

        TranslateModule.forChild()
    ],
    exports     : [
        DesignNavigationComponent
    ],
    declarations: [
        DesignNavigationComponent,
        DesignNavVerticalGroupComponent,
        DesignNavVerticalItemComponent,
        DesignNavVerticalCollapsableComponent,
        DesignNavHorizontalItemComponent,
        DesignNavHorizontalCollapsableComponent
    ]
})
export class DesignNavigationModule
{
}
