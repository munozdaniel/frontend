import { Component } from '@angular/core';

import { DesignTranslationLoaderService } from '@design/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';

@Component({
    selector   : 'sample',
    templateUrl: './sample.component.html',
    styleUrls  : ['./sample.component.scss']
})
export class SampleComponent
{
    /**
     * Constructor
     *
     * @param {DesignTranslationLoaderService} _designTranslationLoaderService
     */
    constructor(
        private _designTranslationLoaderService: DesignTranslationLoaderService
    )
    {
        this._designTranslationLoaderService.loadTranslations(english, turkish);
    }
}
