import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

import { DesignSearchBarModule } from '@design/components';
import { DesignSharedModule } from '@design/shared.module';

import { ToolbarComponent } from 'app/layout/components/toolbar/toolbar.component';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  declarations: [ToolbarComponent],
  imports: [
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    DesignSharedModule,
    DesignSearchBarModule,
    NgxPermissionsModule.forChild(),
  ],
  exports: [ToolbarComponent],
})
export class ToolbarModule {}
