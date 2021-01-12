import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from 'src/app/@fuse/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FuseConfigService } from 'src/app/@fuse/services/config.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/core/services/auth.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { FavoritoService } from 'src/app/core/services/favorito.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.component.html',
  styleUrls: ['./iniciar-sesion.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class IniciarSesionComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  errorLogin = false;
  mensaje: string;
  cargando = false;
  /**
   * Constructor
   *
   * @param {FuseConfigService} _fuseConfigService
   * @param {FormBuilder} _formBuilder
   */
  constructor(
    private location: Location,
    private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _router: Router,
    private _tokenStorage: TokenStorageService,
    private _activeRoute: ActivatedRoute,
    private _favoritoService: FavoritoService
  ) {
    this.verificarError();

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
  }
  ngOnDestroy(): void {}
  verificarError() {
    this._activeRoute.params.subscribe((params) => {
      const error = Number(params['error']);
      if (error === 401) {
        this.mensaje = 'Sesión caducada';
      }
    });
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
  login() {
    if (this.loginForm.valid) {
      this.cargando = true;
      this.errorLogin = false;
      const usuario = this.loginForm.value;
      this._authService.login(usuario).subscribe(
        (datos) => {
          if (datos.success) {
            // Seteo las cookies
            this._tokenStorage.saveToken(datos.token);
            this._tokenStorage.saveUser(datos.usuario);
            this._tokenStorage.saveFavorito(datos.favorito);
            // this._tokenStorage.saveCarrito(datos.carrito);
            // Seteo las sucripciones
            this._tokenStorage.setFavoritoBehavior();
            // this._tokenStorage.setCarritoBehavior();
            this._tokenStorage.setCarritoCantidadBehavior(datos.carritoCantidad);
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
          } else {
            Swal.fire({
              title: 'Ups Ocurrió un error ',
              text: datos.message && datos.message.toString() !== '{}' ? datos.message : 'Login Incorrecto',
              icon: 'error',
            });
            this.cargando = false;
          }
        },
        (error) => {
          console.log('[ERROR]', error);
          this.cargando = false;
          Swal.fire({
            title: 'Acceso Incorrecto',
            text: error.message ? error.message : 'El usuario ingresado no existe.',
            icon: 'error',
            timer: 5000,
            timerProgressBar: true,
          });
        }
      );
    } else {
      this.errorLogin = true;
    }
  }
  retroceder() {
    this.location.back();
  }
}
