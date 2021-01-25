import { Component, Input, OnInit } from '@angular/core';
import { IAlumno } from 'app/models/interface/iAlumno';

@Component({
  selector: 'app-alumnos-ver-ui',
  templateUrl: './alumnos-ver-ui.component.html',
  styleUrls: ['./alumnos-ver-ui.component.scss'],
})
export class AlumnosVerUiComponent implements OnInit {
  @Input() alumno: IAlumno;
  @Input() cargando: boolean;
  constructor() {}

  ngOnInit(): void {}
}
