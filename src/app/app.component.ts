import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DesignConfigService } from '@design/services/config.service';
import { DesignNavigationService } from '@design/components/navigation/navigation.service';
import { DesignSidebarService } from '@design/components/sidebar/sidebar.service';
import { DesignSplashScreenService } from '@design/services/splash-screen.service';

import { navigation } from 'app/navigation/navigation';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IUsuario } from './models/interface/iUsuario';
import { Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { RolConst } from './models/constants/rol.enum';
import { SeguimientoAlumnoService } from './core/services/seguimientoAlumno.service';
import { TemaService } from './core/services/tema.service';
import { AuthService } from './core/auth/auth.service';
import Swal from 'sweetalert2';
@UntilDestroy()
@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  designConfig: any;
  navigation: any;
  public isLogin;
  public usuario: IUsuario;
  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {DOCUMENT} document
   * @param {DesignConfigService} _designConfigService
   * @param {DesignNavigationService} _designNavigationService
   * @param {DesignSidebarService} _designSidebarService
   * @param {DesignSplashScreenService} _designSplashScreenService
   * @param {DesignTranslationLoaderService} _designTranslationLoaderService
   * @param {Platform} _platform
   */
  constructor(
    @Inject(DOCUMENT) private document: any,
    private _permissionsService: NgxPermissionsService,
    private _designConfigService: DesignConfigService,
    private _designNavigationService: DesignNavigationService,
    private _designSidebarService: DesignSidebarService,
    private _designSplashScreenService: DesignSplashScreenService,
    private _platform: Platform,
    private _authService: AuthService,
    private _router: Router,
    private _seguimientoAlumnoService: SeguimientoAlumnoService,
    private _temaService: TemaService
  ) {
    // Get default navigation
    this.navigation = navigation;
    this._designNavigationService.register('main', this.navigation);
    // Register the navigation to the service
    this.comprobarLogin();
    // const perm = ['ADMIN', 'PROFESOR', 'PRECEPTOR', 'INVITADO', 'JEFE', 'DIRECTOR'];
    // this.permissionsService.loadPermissions(perm);
    /**
     * ----------------------------------------------------------------------------------------------------
     * ngxTranslate Fix Start
     * ----------------------------------------------------------------------------------------------------
     */

    /**
     * If you are using a language other than the default one, i.e. Turkish in this case,
     * you may encounter an issue where some of the components are not actually being
     * translated when your app first initialized.
     *
     * This is related to ngxTranslate module and below there is a temporary fix while we
     * are moving the multi language implementation over to the Angular's core language
     * service.
     **/

    // Set the default language to 'en' and then back to 'tr'.
    // '.use' cannot be used here as ngxTranslate won't switch to a language that's already
    // been selected and there is no way to force it, so we overcome the issue by switching
    // the default language back and forth.
    /**
         setTimeout(() => {
            this._translateService.setDefaultLang('en');
            this._translateService.setDefaultLang('tr');
         });
         */

    /**
     * ----------------------------------------------------------------------------------------------------
     * ngxTranslate Fix End
     * ----------------------------------------------------------------------------------------------------
     */

    // Add is-mobile class to the body if the platform is mobile
    if (this._platform.ANDROID || this._platform.IOS) {
      this.document.body.classList.add('is-mobile');
    }

    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to config changes
    this._designConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe((config) => {
      this.designConfig = config;

      // Boxed
      if (this.designConfig.layout.width === 'boxed') {
        this.document.body.classList.add('boxed');
      } else {
        this.document.body.classList.remove('boxed');
      }

      // Color theme - Use normal for loop for IE11 compatibility
      for (let i = 0; i < this.document.body.classList.length; i++) {
        const className = this.document.body.classList[i];

        if (className.startsWith('theme-')) {
          this.document.body.classList.remove(className);
        }
      }

      this.document.body.classList.add(this.designConfig.colorTheme);
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  comprobarLogin() {
    this._authService.currentUser$.pipe(untilDestroyed(this)).subscribe(
      (datos: any) => {
        if (!datos) {
          this.isLogin = false;
          this._router.navigate(['/auth/iniciar-sesion']);
        } else {
          console.log('datos.rol', datos.rol);
          if (!datos.rol) {
            // Swal.fire({
            //   title: 'Usuario Sin Accesos',
            //   text: 'Actualmente no tiene configurado un rol. Comuniquese con el jefe de taller para que le asigne un rol.',
            //   icon: 'warning',
            // });
            this._router.navigate(['/auth/iniciar-sesion']);
          } else {
            const perm = [datos.rol];
            this._permissionsService.loadPermissions(perm);

            this.isLogin = true; // Set the main navigation as our current navigation
            this._designNavigationService.setCurrentNavigation('main');
            const navegacionActual = this._designNavigationService.getNavigationItem('custom-function');
            //  Solo lo debe usar el profesor

            switch (datos.rol) {
              case RolConst.ADMIN:
              case RolConst.JEFETALLER:
                this.setMenuAdmin();

                break;
              case RolConst.PROFESOR:
                console.log('ES UN PROFE');
                this._seguimientoAlumnoService.poolingSeguimientos(datos.email);
                this._temaService.poolingTemas(datos.email);
                // this._seguimientoAlumnoService.poolingSeguimientos(datos.email);
                this._designNavigationService.removeNavigationItem('custom-function');
                break;

              case RolConst.PRECEPTOR:
                this._designNavigationService.removeNavigationItem('taller_planilla');
                this._designNavigationService.removeNavigationItem('custom-function');
                break;
              default:
                break;
            }
          }
        }
      },
      (error) => {
        console.log('[ERROR]', error);
      }
    );
    // this._auth.user$.pipe(untilDestroyed(this)).subscribe(
    //   (datos) => {
    //     console.log('auth user$', datos);
    //     this.isLogin = datos ? true : false;
    //     this.usuario = datos;
    //     if (!datos) {
    //       this._auth.loginWithRedirect();
    //     }
    //   },
    //   (error) => {
    //     console.log('[ERROR]', error);
    //   }
    // );
  }
  setMenuAdmin() {
    const customFunctionNavItem = {
      id: 'custom-function',
      title: 'Administrar',
      type: 'collapsable',
      children: [
        // {
        //   id: 'migrar',
        //   title: 'Migrador',
        //   type: 'item',
        //   icon: 'users',
        //   url: '/administrador/migrar',
        // },
        {
          id: 'alumnos',
          title: 'Alumnos Eliminados',
          type: 'item',
          icon: 'build_circle',
          url: '/administrador/alumnos-eliminados',
        },
        {
          id: 'usuarios',
          title: 'Usuarios',
          type: 'item',
          icon: 'build_circle',
          url: '/administrador/usuarios-roles',
        },
        {
          id: 'ciclo-lectivo',
          title: 'Ciclo Lectivo',
          type: 'item',
          icon: 'warning',
          url: '/administrador/ciclo-lectivo',
        },
        // {
        //   id: 'micuenta',
        //   title: 'Mi Cuenta',
        //   type: 'item',
        //   icon: 'account',
        //   url: '/administrador/mi-cuenta',
        // },
        {
          id: 'calendario',
          title: 'Calendario',
          type: 'item',
          icon: 'today',
          url: '/administrador/calendario-academico',
        },
        // {
        //   id: 'customize',
        //   title: 'Diseño',
        //   type: 'item',
        //   icon: 'settings',
        //   function: () => {
        //     this.toggleSidebarOpen('themeOptionsPanel');
        //   },
        // },
      ],
    };
    this._designNavigationService.addNavigationItem(customFunctionNavItem, 'end');
  }
  /**
   * Toggle sidebar open
   *
   * @param key
   */
  toggleSidebarOpen(key): void {
    this._designSidebarService.getSidebar(key).toggleOpen();
  }
}
