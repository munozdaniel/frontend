import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-profesores-menu-param',
  templateUrl: './profesores-menu-param.component.html',
  styleUrls: ['./profesores-menu-param.component.scss']
})
export class ProfesoresMenuParamComponent implements OnInit {
    @Input() cargando: boolean;
    @Output() retAgregarAsignatura = new EventEmitter<boolean>();
    constructor() {}
  
    ngOnInit(): void {}
    agregarAsignatura() {
      this.retAgregarAsignatura.emit(true);
    }

}
