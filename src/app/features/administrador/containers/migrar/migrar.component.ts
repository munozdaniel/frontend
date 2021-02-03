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
  migradores = [
    { nombre: 'Migrar Comisiones', valor: 1 },
    { nombre: 'Migrar Alumnos', valor: 2 },
    { nombre: 'Migrar Asignaturas', valor: 3 },
    { nombre: 'Migrar Profesores', valor: 4 },
    { nombre: 'Migrar Planilla Taller', valor: 4 },
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
