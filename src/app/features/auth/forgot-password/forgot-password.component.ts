import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DesignConfigService } from '@design/services/config.service';
import { designAnimations } from '@design/animations';
import { UsuarioService } from 'app/core/services/helpers/usuario.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import Swal from 'sweetalert2';
@UntilDestroy()
@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: designAnimations,
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;

  /**
   * Constructor
   *
   * @param {DesignConfigService} _designConfigService
   * @param {FormBuilder} _formBuilder
   */
  constructor(
    private _designConfigService: DesignConfigService,
    private _formBuilder: FormBuilder,
    private _usuarioService: UsuarioService
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
    this.forgotPasswordForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
  enviarEmailRecupero() {
    if (this.forgotPasswordForm.valid) {
      this._usuarioService
        .enviarLink(this.forgotPasswordForm.controls.email.value)
        .pipe(untilDestroyed(this))
        .subscribe(
          (datos) => {
            if (datos && datos.success) {
              Swal.fire({
                title: 'Email Enviado',
                text: 'Se le ha enviado un correo para reiniciar la contraseña',
                icon: 'success',
                timer: 2000,
                timerProgressBar: true,
              }).then(() => {});
            }
          },
          (error) => {
            console.log('[ERROR]', error);
          }
        );
    }
  }
}
