import { NgModule } from "@angular/core";
import { BrowserModule, Title } from "@angular/platform-browser";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
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
import { CallbackComponent } from "./features/callback/callback.component";
import { AppRoutingModule } from "./app-routing.module";
import { AuthHttpInterceptor, AuthModule } from "@auth0/auth0-angular";
import { environment } from "environments/environment";

const appRoutes: Routes = [
    {
        path: "**",
        redirectTo: "home",
    },
];

@NgModule({
    declarations: [AppComponent, CallbackComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),

        AppRoutingModule,

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
        // Import the module into the application, with configuration
        AuthModule.forRoot({
            ...environment.auth,
        }),
    ],
    bootstrap: [AppComponent],
    providers: [
        Title,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthHttpInterceptor,
            multi: true,
        },
    ],
})
export class AppModule {}
