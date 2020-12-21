import { Directive, ElementRef } from '@angular/core';

@Directive({
    selector: '[designWidgetToggle]'
})
export class DesignWidgetToggleDirective
{
    /**
     * Constructor
     *
     * @param {ElementRef} elementRef
     */
    constructor(
        public elementRef: ElementRef
    )
    {
    }
}
