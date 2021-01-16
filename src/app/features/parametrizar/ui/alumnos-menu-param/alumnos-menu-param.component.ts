import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-alumnos-menu-param',
  templateUrl: './alumnos-menu-param.component.html',
  styleUrls: ['./alumnos-menu-param.component.scss'],
})
export class AlumnosMenuParamComponent implements OnInit {
  @Input() cargando: boolean;
  @Output() retAgregarAlumno = new EventEmitter<boolean>();
  constructor() {}

  ngOnInit(): void {}
  agregarAlumno() {
    this.retAgregarAlumno.emit(true);
  }
}
