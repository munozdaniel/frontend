import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DesignConfigService } from '@design/services/config.service';
import { designAnimations } from '@design/animations';
import Swal from 'sweetalert2';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthenticationService } from 'app/core/services/helpers/authentication.service';
import { Router } from '@angular/router';
import { DesignProgressBarService } from '@design/components/progress-bar/progress-bar.service';
import { DesignNavigationService } from '@design/components/navigation/navigation.service';
import { navigation } from 'app/navigation/navigation';
@UntilDestroy()
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: designAnimations,
})
export class LoginComponent implements OnInit {
  hide = true;
  loginForm: FormGroup;

  /**
   * Constructor
   *
   * @param {DesignConfigService} _designConfigService
   * @param {FormBuilder} _formBuilder
   */
  constructor(
    private _designNavigationService: DesignNavigationService,
    private _designProgressBar: DesignProgressBarService,
    private _router: Router,
    private _authService: AuthenticationService,
    private _designConfigService: DesignConfigService,
    private _formBuilder: FormBuilder
  ) {
    // Configure the layout
    this._designConfigService.config = {
      layout: {
        navbar: {
          hidden: true,
        },
        toolbar: {
          hidden: true,
        },
        footer: {
          hidden: true,
        },
        sidepanel: {
          hidden: true,
        },
      },
    };
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  iniciarSesion() {
    if (this.loginForm.invalid) {
      Swal.fire({
        title: 'Complete los datos',
        text: 'Ingrese el email y la contraseña para poder iniciar sesión',
        icon: 'error',
      });
      return;
    }
    const { email, password } = this.loginForm.value;
    this._designProgressBar.show();
    this._authService
      .login(email, password)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          if (!datos || !datos.success) {
            this._designProgressBar.hide();
            Swal.fire({
              title: 'Ingreso Incorrecto',
              text: datos.message,
              icon: 'error',
              timer: 2000,
              timerProgressBar: true,
            }).then(() => {});
            return;
          } else {
            // this._designNavigationService.unregister('navigationEmpty');
            this._designProgressBar.hide();
            Swal.fire({
              title: 'Bienvenido ' + datos.nombre,
              text: 'Recuperando datos...',
              icon: 'success',
              timer: 2000,
              timerProgressBar: true,
            }).then(() => {
              this._router.navigate(['/']);
            });
          }
        },
        (error) => {
          this._designProgressBar.hide();
          Swal.fire({
            title: 'Ingreso Incorrecto',
            text: 'El email o el password no pertenecen a un usuario',
            icon: 'error',
          });
          console.log('[ERROR]', error);
        }
      );
  }
}
