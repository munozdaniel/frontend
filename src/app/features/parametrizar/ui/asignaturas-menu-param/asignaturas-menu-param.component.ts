import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-asignaturas-menu-param',
  templateUrl: './asignaturas-menu-param.component.html',
  styleUrls: ['./asignaturas-menu-param.component.scss'],
})
export class AsignaturasMenuParamComponent implements OnInit {
  @Input() cargando: boolean;
  @Output() retAgregarAsignatura = new EventEmitter<boolean>();
  constructor() {}

  ngOnInit(): void {}
  agregarAsignatura() {
    this.retAgregarAsignatura.emit(true);
  }
}
