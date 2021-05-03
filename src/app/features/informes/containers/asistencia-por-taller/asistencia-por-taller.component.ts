import { Component, OnInit } from '@angular/core';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ReportesService } from 'app/core/services/pdf/reportes.services';
import { PlanillaTallerService } from 'app/core/services/planillaTaller.service';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
@UntilDestroy()
@Component({
  selector: 'app-asistencia-por-taller',
  templateUrl: './asistencia-por-taller.component.html',
  styleUrls: ['./asistencia-por-taller.component.scss'],
  animations: [designAnimations],
})
export class AsistenciaPorTallerComponent implements OnInit {
  titulo = 'Informe de Asistencias por Taller';
  cargando = false;
  planillas: IPlanillaTaller[];
  panelOpenState = true;
  constructor(private _planillaService: PlanillaTallerService, private _reportesService: ReportesService) {}

  ngOnInit(): void {}
  setBuscarPlanilla(evento) {
    if (evento) {
      this.cargando = true;
      const { curso, comision, division, cicloLectivo } = evento;
      this._planillaService
        .obtenerPlanillasPorCursoCiclo(curso, comision, division, cicloLectivo)
        .pipe(untilDestroyed(this))
        .subscribe(
          (datos) => {
            this.planillas = datos.planillasTaller;
            this.cargando = false;
          },
          (error) => {
            this.cargando = false;
            console.log('[ERROR]', error);
          }
        );
    }
  }
  //   =========================================
  setInformeAsistenciasPorTaller(evento: IPlanillaTaller) {
    this._reportesService.planillaTaller = evento;
    this._reportesService.setInformeAsistenciasPorTaller();
  }
  setInformeAsistenciasPorDia(evento: IPlanillaTaller) {
    this._reportesService.planillaTaller = evento;
    this._reportesService.setInformeAsistenciasPorDia();
  }
  setInformeCalificacionesPorTaller(evento: IPlanillaTaller) {
    this._reportesService.planillaTaller = evento;
    this._reportesService.setInformeCalificacionesPorTaller();
  }
  setInformeCalificacionesPorTallerResumido(evento: IPlanillaTaller) {
    this._reportesService.planillaTaller = evento;
    this._reportesService.setInformeCalificacionesPorTallerResumido();
  }
  setInformeLibroTemas(evento: IPlanillaTaller) {
    this._reportesService.planillaTaller = evento;
    this._reportesService.setInformeLibroDeTemas();
  }
  setInformeAlumnosPorTaller(evento: IPlanillaTaller) {
    this._reportesService.planillaTaller = evento;
    this._reportesService.setInformeAlumnosPorTaller();
  }
  setInformeTallerPorAlumnos(evento: IPlanillaTaller) {
    this._reportesService.planillaTaller = evento;
    this._reportesService.setInformeTallerPorAlumnos();
  }
}
