import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators';

import { DesignConfigService } from '@design/services/config.service';
import { DesignNavigationService } from '@design/components/navigation/navigation.service';
import { DesignPerfectScrollbarDirective } from '@design/directives/design-perfect-scrollbar/design-perfect-scrollbar.directive';
import { DesignSidebarService } from '@design/components/sidebar/sidebar.service';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
  selector: 'navbar-vertical-style-1',
  templateUrl: './style-1.component.html',
  styleUrls: ['./style-1.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NavbarVerticalStyle1Component implements OnInit, OnDestroy {
  designConfig: any;
  navigation: any;

  // Private
  private _designPerfectScrollbar: DesignPerfectScrollbarDirective;
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {DesignConfigService} _designConfigService
   * @param {DesignNavigationService} _designNavigationService
   * @param {DesignSidebarService} _designSidebarService
   * @param {Router} _router
   */
  constructor(
    private _designConfigService: DesignConfigService,
    private _designNavigationService: DesignNavigationService,
    private _designSidebarService: DesignSidebarService,
    private _router: Router,
    public authService: AuthService
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  // Directive
  @ViewChild(DesignPerfectScrollbarDirective, { static: true })
  set directive(theDirective: DesignPerfectScrollbarDirective) {
    if (!theDirective) {
      return;
    }

    this._designPerfectScrollbar = theDirective;

    // Update the scrollbar on collapsable item toggle
    this._designNavigationService.onItemCollapseToggled.pipe(delay(500), takeUntil(this._unsubscribeAll)).subscribe(() => {
      this._designPerfectScrollbar.update();
    });

    // Scroll to the active item position
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        take(1)
      )
      .subscribe(() => {
        setTimeout(() => {
          this._designPerfectScrollbar.scrollToElement('navbar .nav-link.active', -120);
        });
      });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(() => {
        if (this._designSidebarService.getSidebar('navbar')) {
          this._designSidebarService.getSidebar('navbar').close();
        }
      });

    // Subscribe to the config changes
    this._designConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe((config) => {
      this.designConfig = config;
    });

    // Get current navigation
    this._designNavigationService.onNavigationChanged
      .pipe(
        filter((value) => value !== null),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(() => {
        this.navigation = this._designNavigationService.getCurrentNavigation();
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
   * Toggle sidebar opened status
   */
  toggleSidebarOpened(): void {
    this._designSidebarService.getSidebar('navbar').toggleOpen();
  }

  /**
   * Toggle sidebar folded status
   */
  toggleSidebarFolded(): void {
    this._designSidebarService.getSidebar('navbar').toggleFold();
  }
}
