import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { designAnimations } from '@design/animations';
import { DesignNavigationService } from '@design/components/navigation/navigation.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthenticationService } from 'app/core/services/helpers/authentication.service';
@UntilDestroy()
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [designAnimations],
})
export class HomeComponent implements OnInit {
  pageTitle = 'Página de Inicio';
  @ViewChild('parametrizacion', { static: false }) parametrizacionDialog: TemplateRef<any>;
  @ViewChild('taller', { static: false }) tallerDialog: TemplateRef<any>;
  @ViewChild('informes', { static: false }) informesDialog: TemplateRef<any>;
  @ViewChild('configuracion', { static: false }) configuracionDialog: TemplateRef<any>;

  constructor(
    private _dialog: MatDialog,
    private title: Title,
    public authService: AuthenticationService,
    private _designNavigationService: DesignNavigationService
  ) {}

  ngOnInit() {
    this.title.setTitle(this.pageTitle);
    const menuExiste = this._designNavigationService.getCurrentNavigation();
    if (!menuExiste || menuExiste.length < 1) {
      // No hay menu cargado, verificamos si está logueado y seteamos el menu
      this.authService.currentUser$.pipe(untilDestroyed(this)).subscribe(
        (datos) => {
          if (datos) {
            this._designNavigationService.setCurrentNavigation('main');
          }
        },
        (error) => {
          console.log('[ERROR]', error);
        }
      );
    }
  }
  abrirParametrizar() {
    this._dialog.open(this.parametrizacionDialog, {
      maxWidth: '40em',
      width: '40em',
      backdropClass: 'backdropBackground',
    });
  }
  abrirTaller() {
    this._dialog.open(this.tallerDialog, {
      maxWidth: '40em',
      width: '40em',
      backdropClass: 'backdropBackground',
    });
  }
  abrirInformes() {
    this._dialog.open(this.informesDialog, {
      maxWidth: '40em',
      width: '40em',
      backdropClass: 'backdropBackground',
    });
  }
  abrirConfiguracion() {
    this._dialog.open(this.configuracionDialog, {
      maxWidth: '40em',
      width: '40em',
      backdropClass: 'backdropBackground',
    });
  }
}
