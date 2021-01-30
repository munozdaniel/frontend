import { Component, OnInit } from '@angular/core';
import { designAnimations } from '@design/animations';
import { DesignProgressBarService } from '@design/components/progress-bar/progress-bar.service';
import { AlumnoService } from 'app/core/services/alumno.service';
import { IAlumno } from 'app/models/interface/iAlumno';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IFichaAlumnoParam } from 'app/models/interface/iFichaAlumnoParam';

@UntilDestroy()
@Component({
  selector: 'app-ficha-alumnos',
  templateUrl: './ficha-alumnos.component.html',
  styles: [],
  animations: designAnimations,
})
export class FichaAlumnosComponent implements OnInit {
  titulo = 'Buscar fichas de alumnos';
  cargando = false;
  alumnos: IAlumno[];
  constructor(private _alumnoService: AlumnoService, private _designProgressBar: DesignProgressBarService) {}

  ngOnInit(): void {}
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
            this.cargando = false;
          },
          (error) => {
            this.cargando = false;
            console.log('[ERROR]', error);
          }
        );
    }
  }
  setFichaPersonal(evento: IAlumno) {
    if (evento) {
      // generar pdf
    }
  }
}
