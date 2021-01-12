import { NgModule } from "@angular/core";
import { BrowserModule, Title } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { TranslateModule } from "@ngx-translate/core";
import "hammerjs";

import { DesignModule } from "@design/design.module";
import { DesignSharedModule } from "@design/shared.module";
import {
    DesignProgressBarModule,
    DesignSidebarModule,
    DesignThemeOptionsModule,
} from "@design/components";

import { designConfig } from "app/design-config";

import { AppComponent } from "app/app.component";
import { LayoutModule } from "app/layout/layout.module";

const appRoutes: Routes = [
    {
        path: "**",
        redirectTo: "home",
    },
];

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),

        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Design modules
        DesignModule.forRoot(designConfig),
        DesignProgressBarModule,
        DesignSharedModule,
        DesignSidebarModule,
        DesignThemeOptionsModule,

        // App modules
        LayoutModule,
    ],
    bootstrap: [AppComponent],
    providers: [Title],
})
export class AppModule {}
