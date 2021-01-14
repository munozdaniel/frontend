import { NgModule, Optional, SkipSelf } from "@angular/core";
import { CoreRoutingModule } from "./core.router";

@NgModule({
    imports: [CoreRoutingModule],
    exports: [],
    entryComponents: [],
    providers: [],
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error(
                "CoreModule is already loaded. Import it in the AppModule only"
            );
        }
    }
}
