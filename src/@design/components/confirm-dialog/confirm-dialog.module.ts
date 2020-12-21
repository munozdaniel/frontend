import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { DesignConfirmDialogComponent } from '@design/components/confirm-dialog/confirm-dialog.component';

@NgModule({
    declarations: [
        DesignConfirmDialogComponent
    ],
    imports: [
        MatDialogModule,
        MatButtonModule
    ],
    entryComponents: [
        DesignConfirmDialogComponent
    ],
})
export class DesignConfirmDialogModule
{
}
