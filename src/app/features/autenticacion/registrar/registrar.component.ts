import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Subject } from 'rxjs';
import { FuseConfigService } from 'src/app/@fuse/services/config.service';
import { takeUntil } from 'rxjs/operators';
import { IUsuario } from 'src/app/models/interfaces/iUsuario';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: designAnimations,
})
export class RegistrarComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  cargando = false;
  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private location: Location,
    private _router: Router,
    private _tokenStorage: TokenStorageService,
    private _authService: AuthService,
    private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder
  ) {
    // Configure the layout
    this._fuseConfigService.config = {
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
    this.registerForm = this._formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      apellido: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(6), Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.min(6), Validators.maxLength(50)]],
      passwordConfirm: ['', [Validators.required, confirmPasswordValidator, Validators.minLength(6), Validators.maxLength(50)]],
    });

    // Update the validity of the 'passwordConfirm' field
    // when the 'password' field changes
    this.registerForm
      .get('password')
      .valueChanges.pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this.registerForm.get('passwordConfirm').updateValueAndValidity();
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
  guardarUsuario() {
    this.cargando = true;
    const { apellido, email, nombre, password } = this.registerForm.value;
    const usuario: IUsuario = { apellido, email, nombre, password, perfilCompleto: false, activo: true };
    this._authService.registrar(usuario).subscribe(
      (datos) => {
        console.log('Datos', datos);
        this._tokenStorage.saveToken(datos.token);
        this._tokenStorage.saveUser(datos.usuario);
        Swal.fire({
          title: 'Bienvenido ',
          text: 'Redireccionado...',
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          this._router.navigate(['/']);
        });
        this.cargando = false;
      },
      (errorResponse) => {
        console.log('[ERROR]', errorResponse);
        this.cargando = false;
        const mensaje =
          typeof errorResponse === 'string'
            ? errorResponse
            : errorResponse.error && errorResponse.error.message
            ? errorResponse.error.message
            : 'El usuario no ha podido crearse correctamente';
        Swal.fire({
          title: 'Ups! ocurrió un error',
          text: `${mensaje}`,
          icon: 'error',
        });
      }
    );
  }
  retroceder() {
    this.location.back();
  }
}

/**
 * Validador de contraseñas
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
