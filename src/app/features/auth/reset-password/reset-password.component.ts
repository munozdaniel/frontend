import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DesignConfigService } from '@design/services/config.service';
import { designAnimations } from '@design/animations';
import { MustMatchValidator } from 'app/shared/validators/must-match.validator';
import { CustomValidators } from '../register/custom-validators';
import Swal from 'sweetalert2';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'app/core/services/helpers/usuario.service';
import { DesignProgressBarService } from '@design/components/progress-bar/progress-bar.service';
@UntilDestroy()
@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: designAnimations,
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  hide2 = true;
  hide = true;
  cargando = false;
  resetPasswordForm: FormGroup;
  _id: string;
  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _activeRoute: ActivatedRoute,
    private _designProgressBar: DesignProgressBarService,
    private _router: Router,
    private _usuarioService: UsuarioService,
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
    this._activeRoute.params.subscribe((params) => {
      this._id = params['id'];
    });
    this.resetPasswordForm = this._formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: [
          null,
          Validators.compose([
            Validators.required,
            // check whether the entered password has a number
            CustomValidators.patternValidator(/\d/, {
              hasNumber: true,
            }),
            // check whether the entered password has upper case letter
            CustomValidators.patternValidator(/[A-Z]/, {
              hasCapitalCase: true,
            }),
            // check whether the entered password has a lower case letter
            CustomValidators.patternValidator(/[a-z]/, {
              hasSmallCase: true,
            }),
            // check whether the entered password has a special character
            CustomValidators.patternValidator(/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, {
              hasSpecialCharacters: true,
            }),
            Validators.minLength(8),
          ]),
        ],
        passwordConfirm: ['', [Validators.compose([Validators.required])]],
      },
      {
        validator: MustMatchValidator('password', 'passwordConfirm'),
      }
    );

    // Update the validity of the 'passwordConfirm' field
    // when the 'password' field changes
    // this.resetPasswordForm.get('password').valueChanges
    //     .pipe(takeUntil(this._unsubscribeAll))
    //     .subscribe(() => {
    //         this.resetPasswordForm.get('passwordConfirm').updateValueAndValidity();
    //     });
  }
  get f() {
    return this.resetPasswordForm.controls;
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  resetear() {
    if (this.resetPasswordForm.invalid) {
      Swal.fire({
        title: 'Complete los datos',
        text: 'Complete el formulario para poder resetear la contraseña',
        icon: 'error',
      });
      return;
    }
    const { email, password, passwordConfirm } = this.resetPasswordForm.value;
    this._usuarioService
      .cambiarContrasena(email, password, passwordConfirm, this._id)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this._designProgressBar.hide();
          //   this._designNavigationService.setCurrentNavigation('main');
          Swal.fire({
            title: 'Bienvenido ' + datos.usuario.apellido + ' ' + datos.usuario.nombre,
            text: 'Redireccionando...',
            icon: 'success',
            timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            this._router.navigate(['/auth/iniciar-sesion']);
          });
        },
        ({ error }) => {
          if (error && error.status === 400) {
            Swal.fire({
              title: 'Error en el registro',
              text: error.message,
              icon: 'error',
            });
          } else {
            Swal.fire({
              title: 'Registro Fallido',
              text: 'Verifique que los datos hayan sido ingresado correctamente. Si el problema persiste comuniquese con el soporte técnico.',
              icon: 'error',
            });
          }
          this._designProgressBar.hide();

          console.log('[ERROR]', error);
        }
      );
  }
}

/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }

  const password = control.parent.get('password');
  const passwordConfirm = control.parent.get('passwordConfirm');

  if (!password || !passwordConfirm) {
    return null;
  }

  if (passwordConfirm.value === '') {
    return null;
  }

  if (password.value === passwordConfirm.value) {
    return null;
  }

  return { passwordsNotMatching: true };
};
