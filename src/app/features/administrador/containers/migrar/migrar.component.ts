import { Component, OnInit } from '@angular/core';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AlumnoService } from 'app/core/services/alumno.service';
import { AsignaturaService } from 'app/core/services/asignatura.service';
import { ComisionService } from 'app/core/services/comision.service';
import { PlanillaTallerService } from 'app/core/services/planillaTaller.service';
import { ProfesorService } from 'app/core/services/profesor.service';
@UntilDestroy()
@Component({
  selector: 'app-migrar',
  templateUrl: './migrar.component.html',
  styleUrls: ['./migrar.component.scss'],
  animations: [designAnimations],
})
export class MigrarComponent implements OnInit {
  titulo = 'Migrar Datos';
  cargando = false;
  resultado: any;
  constructor(
    private _comisionService: ComisionService,
    private _alumnoService: AlumnoService,
    private _asignaturaService: AsignaturaService,
    private _profesorService: ProfesorService,
    private _planillaTallerService: PlanillaTallerService
  ) {}

  ngOnInit(): void {}
  migrarComisiones() {}
  listarAlumnos() {
    this.cargando = true;
    this._alumnoService
      .obtenerAlumnos()
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.resultado = datos;
          this.cargando = false;
        },
        (error) => {
          this.cargando = false;
          console.log('[ERROR]', error);
        }
      );
  }
  eliminarAlumnos() {
    this.cargando = true;
    this._alumnoService.eliminarColeccion().pipe(untilDestroyed(this))
    .subscribe(
      (datos) => {
        this.resultado = datos;
        this.cargando = false;
      },
      (error) => {
        this.cargando = false;
        console.log('[ERROR]', error);
      }
    );;
  }
  migrarAlumnos() {
    this.cargando = true;
    this._alumnoService
      .migrar()
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.resultado = datos;
          this.cargando = false;
        },
        (error) => {
          this.cargando = false;
          console.log('[ERROR]', error);
        }
      );
  }
  migrarProfesores() {}
  migrarAsignaturas() {}
  migrarPlantillaTaller() {}
  migrarTemas() {}
  migrarSeguimiento() {}
  migrarAsistencia() {}
  migrarCalificaciones() {}
  migrarCalendario() {}
}
