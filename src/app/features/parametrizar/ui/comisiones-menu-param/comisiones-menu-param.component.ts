import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-comisiones-menu-param',
  templateUrl: './comisiones-menu-param.component.html',
  styleUrls: ['./comisiones-menu-param.component.scss'],
})
export class ComisionesMenuParamComponent implements OnInit {
  @Input() cargando: boolean;
  @Output() retAgregarComision = new EventEmitter<boolean>();
  constructor() {}

  ngOnInit(): void {}
  agregarComision() {
    this.retAgregarComision.emit(true);
  }
}
