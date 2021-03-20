import { Component, OnInit } from '@angular/core';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UsuarioService } from 'app/core/services/helpers/usuario.service';
import { IUsuario } from 'app/models/interface/iUsuario';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
@UntilDestroy()
@Component({
  selector: 'app-roles',
  template: `
    <button-volver></button-volver>
    <div fxLayout="column" class="w-100-p p-24 mt-50" fxLayoutGap="20px">
      <div fxLayout="column" class="mat-card mat-elevation-z4 p-24">
        <div fxLayout="row wrap" fxLayoutAlign="space-between center" class="w-100-p mb-12" style="border-bottom: 2px solid #80808057;">
          <div>
            <h1 [@animate]="{ value: '*', params: { x: '50px' } }" class="px-12">{{ titulo }}</h1>
            <mat-spinner *ngIf="cargando" matSuffix class="ml-10" diameter="20"></mat-spinner>
          </div>
        </div>
      </div>
      <!--  -->
      <div fxLayout="row" fxLayoutAlign="center start" class="w-100-p">
        <app-usuarios-tabla fxFlex="100" [usuarios]="usuarios" (retCambiarRol)="setCambiarRol($event)"> </app-usuarios-tabla>
      </div>
    </div>
  `,
  styles: [],
  animations: [designAnimations],
})
export class RolesComponent implements OnInit {
  titulo = 'Administrar Roles';
  cargando = false;
  //
  usuarios: IUsuario[];
  usuarioSeleccionado: IUsuario;
  // Mobile
  isMobile: boolean;
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  constructor(private _usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }
  cargarUsuarios() {
    this.cargando = true;
    this._usuarioService
      .obtenerUsuarioConRoles()
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.usuarios = datos;
          this.cargando = false;
        },
        (error) => {
          this.cargando = false;
          console.log('[ERROR]', error);
        }
      );
  }

  setCambiarRol(evento) {
    Swal.fire({
      title: '¿Está seguro de continuar?',
      html: 'Está a punto de cambiar el rol al usuario',
      icon: 'warning',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this._usuarioService.cambiarRol(evento._id, evento.rol).pipe(
          catchError((error) => {
            console.log('[ERROR]', error);
            Swal.fire({
              title: 'Oops! Ocurrió un error',
              text: error && error.error ? error.error.message : 'Error de conexion',
              icon: 'error',
            });
            return of(error);
          })
        );
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result: any) => {
      if (result.isConfirmed) {
        if (result.value && result.value.status === 200) {
          Swal.fire({
            title: 'Operación Exitosa',
            text: 'El usuario ha sido actualizado con un nuevo rol.',
            icon: 'success',
          });
        } else {
          Swal.fire({
            title: 'Oops! Ocurrió un error',
            text: 'Intentelo nuevamente. Si el problema persiste comuniquese con el soporte técnico.',
            icon: 'error',
          });
        }
      }
    });
  }
}
