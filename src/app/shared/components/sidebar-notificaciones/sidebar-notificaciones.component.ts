import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DesignSidebarService } from '@design/components/sidebar/sidebar.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SeguimientoAlumnoService } from 'app/core/services/seguimientoAlumno.service';
import { TemaService } from 'app/core/services/tema.service';
import { RolConst } from 'app/models/constants/rol.enum';
import { ISeguimientoAlumno } from 'app/models/interface/iSeguimientoAlumno';
import { ITemaPendiente } from 'app/models/interface/iTemaPendiente';
import { NgxPermissionsService } from 'ngx-permissions';
import Swal from 'sweetalert2';
@UntilDestroy()
@Component({
  selector: 'app-sidebar-notificaciones',
  templateUrl: './sidebar-notificaciones.component.html',
  styleUrls: ['./sidebar-notificaciones.component.scss'],
})
export class SidebarNotificacionesComponent implements OnInit {
  cargando: boolean;
  seguimientosSinLeer: ISeguimientoAlumno[] = [];
  temasPendientes: ITemaPendiente[] = [];
  constructor(
    private _permissionsService: NgxPermissionsService,
    private _router: Router,
    private _seguimientoService: SeguimientoAlumnoService,
    private _temaService: TemaService,
    private _designSidebarService: DesignSidebarService
  ) {}

  ngOnInit(): void {
    this._permissionsService.permissions$.subscribe((permissions) => {
      const permisos = Object.keys(permissions);
      if (permisos && permisos.length > 0) {
        const index = permisos.findIndex((x) => x.toString() === RolConst.PROFESOR);
        if (index !== -1) {
          this._seguimientoService.seguimientos$.pipe(untilDestroyed(this)).subscribe((datos) => {
            this.seguimientosSinLeer = datos;
          });
          this._temaService.temas$.pipe(untilDestroyed(this)).subscribe((datos) => {
            console.log('================', datos);
            this.temasPendientes = datos;
          });
        }
      }
    });
  }
  cerrar() {
    this._designSidebarService.getSidebar('notificaciones').close();
  }
  redireccionarSeguimiento(seguimiento: ISeguimientoAlumno) {
    seguimiento.leido = true;
    this.actualizarComoLeido(seguimiento);
  }
  actualizarComoLeido(seguimiento: ISeguimientoAlumno) {
    this.cargando = true;

    this._seguimientoService
      .marcarSeguimientoLeido(seguimiento)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.cargando = false;
          if (seguimiento.planillaTaller._id) {
            this._router.navigate(['/taller/planillas-administrar/' + seguimiento.planillaTaller._id + '/seguimientos/' + seguimiento._id]);
          } else {
            this._router.navigate(['/taller/planillas-administrar/' + seguimiento.planillaTaller + '/seguimientos/' + seguimiento._id]);
          }
        },
        (error) => {
          this.cargando = false;
          console.log('[ERROR]', error);
          Swal.fire({
            title: 'Ocurrió un error',
            text: 'No se pudo marcar el seguimiento como leído',
            icon: 'error',
          });
        }
      );
  }
  redireccionarTema(tema: ITemaPendiente) {
    if (tema.planillaTaller._id) {
      this._router.navigate(['/taller/planillas-administrar/' + tema.planillaTaller._id + '/temas']);
    } else {
      this._router.navigate(['/taller/planillas-administrar/' + tema.planillaTaller + '/temas']);
    }
  }
}
