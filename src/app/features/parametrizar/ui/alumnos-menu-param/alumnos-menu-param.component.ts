import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-alumnos-menu-param',
  templateUrl: './alumnos-menu-param.component.html',
  styleUrls: ['./alumnos-menu-param.component.scss'],
})
export class AlumnosMenuParamComponent implements OnInit {
  @Input() titulo: string = 'Alumnos';
  @Input() cargando: boolean;
  @Input() soloLectura: boolean;
  @Output() retAgregarAlumno = new EventEmitter<boolean>();
  @Output() retHabilitarEdicion = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {}
  agregarAlumno() {
    this.retAgregarAlumno.emit(true);
  }
  editarAlumno() {
    this.retHabilitarEdicion.emit(true);
  }
}
