import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DesignSidebarService } from '@design/components/sidebar/sidebar.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SeguimientoAlumnoService } from 'app/core/services/seguimientoAlumno.service';
import { ISeguimientoAlumno } from 'app/models/interface/iSeguimientoAlumno';
@UntilDestroy()
@Component({
  selector: 'app-sidebar-notificaciones',
  templateUrl: './sidebar-notificaciones.component.html',
  styleUrls: ['./sidebar-notificaciones.component.scss'],
})
export class SidebarNotificacionesComponent implements OnInit {
  seguimientosSinLeer: ISeguimientoAlumno[] = [];
  constructor(
    private _router: Router,
    private _seguimientoService: SeguimientoAlumnoService,
    private _designSidebarService: DesignSidebarService
  ) {}

  ngOnInit(): void {
    this._seguimientoService.seguimientos$.pipe(untilDestroyed(this)).subscribe((datos) => {
      this.seguimientosSinLeer = datos;
    });
  }
  cerrar() {
    this._designSidebarService.getSidebar('notificaciones').close();
  }
  redireccionarSeguimiento(seguimiento: ISeguimientoAlumno) {
     if (seguimiento.planillaTaller._id) {
      this._router.navigate([
        '/taller/planillas-administrar/' + seguimiento.planillaTaller._id + '/seguimientos/' + seguimiento._id,
      ]);
    } else {
      this._router.navigate(['/taller/planillas-administrar/' + seguimiento.planillaTaller + '/seguimientos/' + seguimiento._id]);
    }
  }
}
