import { Component, OnInit } from '@angular/core';
import { designAnimations } from '@design/animations';
import { DesignProgressBarService } from '@design/components/progress-bar/progress-bar.service';
import { AlumnoService } from 'app/core/services/alumno.service';
import { IAlumno } from 'app/models/interface/iAlumno';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IFichaAlumnoParam } from 'app/models/interface/iFichaAlumnoParam';
import { ALUMNO_OPERACION } from 'app/models/constants/alumno-operacion.enum';
import Swal from 'sweetalert2';
import { ToastService } from 'app/core/services/general/toast.service';
import { ICicloLectivo } from 'app/models/interface/iCicloLectivo';
import { CicloLectivoService } from 'app/core/services/ciclo-lectivo.service';

@UntilDestroy()
@Component({
  selector: 'app-ficha-alumnos',
  templateUrl: './ficha-alumnos.component.html',
  styles: [],
  animations: designAnimations,
})
export class FichaAlumnosComponent implements OnInit {
  titulo = 'Buscar fichas de alumnos/as';
  cargando = false;
  alumnos: IAlumno[];
  alumnoOperacion = ALUMNO_OPERACION;
  ciclosLectivos: ICicloLectivo[];
  constructor(
    private _toastService: ToastService,
    private _alumnoService: AlumnoService,
    private _cicloLectivoService: CicloLectivoService,
    private _designProgressBar: DesignProgressBarService
  ) {}

  ngOnInit(): void {
    this._cicloLectivoService
      .obtenerCiclosLectivos()
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
            this.ciclosLectivos = datos;
        },
        (error) => {
          console.log('[ERROR]', error);
        }
      );
  }
  setParametrosBusqueda(evento: IFichaAlumnoParam) {
    if (evento) {
      this.cargando = true;
      const { cicloLectivo, division, curso } = evento;
      this._alumnoService
        .obtenerFichaAlumnos(cicloLectivo, division, curso)
        .pipe(untilDestroyed(this))
        .subscribe(
          (alumnos) => {
            console.log('Datos', alumnos);
            this.alumnos = alumnos;
            if (alumnos.length < 1) {
              this._toastService.sinRegistros();
            }
            this.cargando = false;
          },
          (error) => {
            this.cargando = false;
            console.log('[ERROR]', error);
            Swal.fire({
              title: 'Oops! Ocurrió un error',
              html:
                'No se pudieron recuperar los registros de la base de datos. <br> Si el problema persiste comuniquesé con el soporte técnico.',
              icon: 'error',
            });
          }
        );
    }
  }

}
