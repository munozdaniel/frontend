import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IAdulto } from 'app/models/interface/iAdulto';

@Component({
  selector: 'app-adultos-tabla-param',
  templateUrl: './adultos-tabla-param.component.html',
})
export class AdultosTablaParamComponent implements OnInit {
  @Input() adultos: IAdulto[];
  @Output() retEliminarAdulto = new EventEmitter<IAdulto>();
  @Output() retEditarAdulto = new EventEmitter<IAdulto>();
  constructor() {}

  ngOnInit(): void {}
  quitarAdulto(adulto) {
    this.retEliminarAdulto.emit(adulto);
  }
  editarAdulto(adulto) {
    this.retEditarAdulto.emit(adulto);
  }
}
