import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';

import { DesignConfigService } from '@design/services/config.service';
import { designAnimations } from '@design/animations';
import Swal from 'sweetalert2';
import { IUsuario } from 'app/models/interface/iUsuario';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Router } from '@angular/router';
import { DesignProgressBarService } from '@design/components/progress-bar/progress-bar.service';
import { CustomValidators } from './custom-validators';
import { MustMatchValidator } from 'app/shared/validators/must-match.validator';
import { DesignNavigationService } from '@design/components/navigation/navigation.service';
import { AuthService } from 'app/core/auth/auth.service';

@UntilDestroy()
@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: designAnimations,
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  hide2 = true;
  hide = true;
  cargando = false;
  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _designNavigationService: DesignNavigationService,
    private _designProgressBar: DesignProgressBarService,
    private _router: Router,
    private _authService: AuthService,
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
    this.registerForm = this._formBuilder.group(
      {
        nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
        apellido: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
        email: ['', [Validators.required, Validators.email, Validators.minLength(6), Validators.maxLength(100)]],
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
    // this.registerForm
    //   .get('password')
    //   .valueChanges.pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe(() => {
    //     this.registerForm.get('passwordConfirm').updateValueAndValidity();
    //   });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  registrarUsuario() {
    if (this.registerForm.invalid) {
      Swal.fire({
        title: 'Complete los datos',
        text: 'Complete el formulario para poder crear la cuenta',
        icon: 'error',
      });
      return;
    }
    const { nombre, apellido, email, password } = this.registerForm.value;
    const usuario: IUsuario = {
      email,
      password,
      nombre,
      apellido,
      activo: true,
      fechaCreacion: new Date(),
    };
    this._designProgressBar.show();
    this._authService
      .registrar(usuario)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this._designProgressBar.hide();
          //   this._designNavigationService.setCurrentNavigation('main');
          //   Swal.fire({
          //     title: 'Bienvenido ' + datos.usuario.apellido + ' ' + datos.usuario.nombre,
          //     text: 'Redireccionando...',
          //     icon: 'success',
          //     timer: 2000,
          //     timerProgressBar: true,
          //   }).then(() => {
          //     this._router.navigate(['/']);
          //   });
          setTimeout(() => {
            this._router.navigate(['/']);
          }, 2000);
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
  get f() {
    return this.registerForm.controls;
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
