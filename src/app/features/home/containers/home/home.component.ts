import { Component, OnInit } from '@angular/core';
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

  constructor(private title: Title, public authService: AuthenticationService, private _designNavigationService: DesignNavigationService) {}

  ngOnInit() {
    this.title.setTitle(this.pageTitle);
    const menuExiste = this._designNavigationService.getCurrentNavigation();
    console.log('this._designNavigationService.getCurrentNavigation();', menuExiste);
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
}
