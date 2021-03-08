import { Component, Input, OnInit } from '@angular/core';
import { IAlumno } from 'app/models/interface/iAlumno';
import { IAsistencia } from 'app/models/interface/iAsistencia';

@Component({
  selector: 'app-administrar-asistencias',
  templateUrl: './administrar-asistencias.component.html',
  styleUrls: ['./administrar-asistencias.component.scss']
})
export class AdministrarAsistenciasComponent implements OnInit {
    @Input() cargandoAsistencias: boolean;
    @Input() cargandoAlumnos: boolean;
    @Input() alumnos: IAlumno[] & IAsistencia[];
    @Input() asistencias: IAsistencia[];
    titulo = 'Asistencias';
  constructor() { }

  ngOnInit(): void {
  }

}
