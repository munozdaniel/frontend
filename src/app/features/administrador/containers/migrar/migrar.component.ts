import { Component, OnInit } from '@angular/core';
import { AlumnoService } from 'app/core/services/alumno.service';
import { AsignaturaService } from 'app/core/services/asignatura.service';
import { ComisionService } from 'app/core/services/comision.service';
import { PlanillaTallerService } from 'app/core/services/planillaTaller.service';
import { ProfesorService } from 'app/core/services/profesor.service';

@Component({
  selector: 'app-migrar',
  templateUrl: './migrar.component.html',
  styleUrls: ['./migrar.component.scss'],
})
export class MigrarComponent implements OnInit {
  titulo = 'Migrar Datos';
  cargando = false;
  migradores = [
    { nombre: 'Migrar Comisiones', valor: 1, url: '' },
    { nombre: 'Migrar Alumnos', valor: 2, url: '' },
    { nombre: 'Migrar Asignaturas', valor: 3, url: '' },
    { nombre: 'Migrar Profesores', valor: 4, url: '' },
    { nombre: 'Migrar Planilla Taller', valor: 4, url: '' },
  ];
  constructor(
    private _comisionService: ComisionService,
    private _alumnoService: AlumnoService,
    private _asignaturaService: AsignaturaService,
    private _profesorService: ProfesorService,
    private _planillaTallerService: PlanillaTallerService
  ) {}

  ngOnInit(): void {}
  migrarComisiones() {}
  migrarAlumnos() {}
  migrarProfesores() {}
  migrarAsignaturas() {}
  migrarPlantillaTaller() {}
  migrarTemas() {}
  migrarSeguimiento() {}
  migrarAsistencia() {}
  migrarCalificaciones() {}
  migrarCalendario() {}
}
