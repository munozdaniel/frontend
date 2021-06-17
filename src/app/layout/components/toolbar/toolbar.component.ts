import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';

import { DesignConfigService } from '@design/services/config.service';
import { DesignSidebarService } from '@design/components/sidebar/sidebar.service';

import { navigation } from 'app/navigation/navigation';
import { DOCUMENT } from '@angular/common';
import { SeguimientoAlumnoService } from 'app/core/services/seguimientoAlumno.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ISeguimientoAlumno } from 'app/models/interface/iSeguimientoAlumno';
import { MediaMatcher, BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { ITemaPendiente } from 'app/models/interface/iTemaPendiente';
import { TemaService } from 'app/core/services/tema.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { RolConst } from 'app/models/constants/rol.enum';
import { AuthService } from 'app/core/auth/auth.service';
@UntilDestroy()
@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ToolbarComponent implements OnInit, OnDestroy {
  horizontalNavbar: boolean;
  rightNavbar: boolean;
  hiddenNavbar: boolean;
  languages: any;
  navigation: any;
  userStatusOptions: any[];

  // Private
  private _unsubscribeAll: Subject<any>;
  seguimientosSinLeer: ISeguimientoAlumno[] = [];
  temasPendientes: ITemaPendiente[] = [];
  // Mobile
  isMobile: boolean;
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  /**
   * Constructor
   *
   * @param {DesignConfigService} _designConfigService
   * @param {DesignSidebarService} _designSidebarService
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _media: MediaMatcher,
    public breakpointObserver: BreakpointObserver,
    public authService: AuthService,
    @Inject(DOCUMENT) public document: Document,
    private _designConfigService: DesignConfigService,
    private _designSidebarService: DesignSidebarService,
    private _temaService: TemaService,
    private _permissionsService: NgxPermissionsService,
    private _seguimientoService: SeguimientoAlumnoService
  ) {
    this.mobileQuery = this._media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this._changeDetectorRef.detectChanges();
    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.HandsetPortrait]).subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
    // Set the defaults
    this.userStatusOptions = [
      {
        title: 'Online',
        icon: 'icon-checkbox-marked-circle',
        color: '#4CAF50',
      },
      {
        title: 'Away',
        icon: 'icon-clock',
        color: '#FFC107',
      },
      {
        title: 'Do not Disturb',
        icon: 'icon-minus-circle',
        color: '#F44336',
      },
      {
        title: 'Invisible',
        icon: 'icon-checkbox-blank-circle-outline',
        color: '#BDBDBD',
      },
      {
        title: 'Offline',
        icon: 'icon-checkbox-blank-circle-outline',
        color: '#616161',
      },
    ];

    // this.languages = [
    //   {
    //     id: 'en',
    //     title: 'English',
    //     flag: 'us',
    //   },
    //   {
    //     id: 'tr',
    //     title: 'Turkish',
    //     flag: 'tr',
    //   },
    // ];

    this.navigation = navigation;

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
    // Subscribe to the config changes
    this._designConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe((settings) => {
      this.horizontalNavbar = settings.layout.navbar.position === 'top';
      this.rightNavbar = settings.layout.navbar.position === 'right';
      this.hiddenNavbar = settings.layout.navbar.hidden === true;
    });
    this._permissionsService.permissions$.subscribe((permissions) => {
      const permisos = Object.keys(permissions);
      if (permisos && permisos.length > 0) {
        const index = permisos.findIndex((x) => x.toString() === RolConst.PROFESOR);
        if (index !== -1) {
          this._seguimientoService.seguimientos$.pipe(untilDestroyed(this)).subscribe((datos) => {
            this.seguimientosSinLeer = datos;
          });
          this._temaService.temas$.pipe(untilDestroyed(this)).subscribe((datos) => {
            this.temasPendientes = datos;
          });
        }
      }
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

  /**
   * Toggle sidebar open
   *
   * @param key
   */
  toggleSidebarOpen(key): void {
    this._designSidebarService.getSidebar(key).toggleOpen();
  }
  mostrarSideBarSeguimientos() {
    if (this._designSidebarService.getSidebar('notificaciones')) {
      this._designSidebarService.getSidebar('notificaciones').toggleOpen();
    }
  }
}
