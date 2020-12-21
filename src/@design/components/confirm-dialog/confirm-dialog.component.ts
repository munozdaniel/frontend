import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector   : 'design-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls  : ['./confirm-dialog.component.scss']
})
export class DesignConfirmDialogComponent
{
    public confirmMessage: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<DesignConfirmDialogComponent>} dialogRef
     */
    constructor(
        public dialogRef: MatDialogRef<DesignConfirmDialogComponent>
    )
    {
    }

}
