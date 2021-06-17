import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import 'hammerjs';

import { DesignModule } from '@design/design.module';
import { DesignSharedModule } from '@design/shared.module';
import { DesignProgressBarModule, DesignSidebarModule, DesignThemeOptionsModule } from '@design/components';

import { designConfig } from 'app/design-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { CallbackComponent } from './features/callback/callback.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { registerLocaleData } from '@angular/common';

import localeEsAr from '@angular/common/locales/es-AR';
import { NgxPermissionsModule } from 'ngx-permissions';
import { appInitializer } from './core/auth/app-initializer';
import { AuthService } from './core/auth/auth.service';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
import { UnauthorizedInterceptor } from './core/interceptors/unauthorized.interceptor';

registerLocaleData(localeEsAr, 'es-Ar');

const appRoutes: Routes = [
  {
    path: '**',
    redirectTo: 'home',
  },
];

@NgModule({
  declarations: [AppComponent, CallbackComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    NgxPermissionsModule.forRoot(),

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
    // Shared
    SharedModule,
    // App modules
    LayoutModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AuthService],
    },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedInterceptor,
      multi: true,
    },
    ,
    Title,
    { provide: LOCALE_ID, useValue: 'es-Ar' },
  ],
})
export class AppModule {}
