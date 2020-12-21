import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { FUSE_CONFIG } from '@design/services/config.service';

@NgModule()
export class DesignModule
{
    constructor(@Optional() @SkipSelf() parentModule: DesignModule)
    {
        if ( parentModule )
        {
            throw new Error('DesignModule is already loaded. Import it in the AppModule only!');
        }
    }

    static forRoot(config): ModuleWithProviders
    {
        return {
            ngModule : DesignModule,
            providers: [
                {
                    provide : FUSE_CONFIG,
                    useValue: config
                }
            ]
        };
    }
}
