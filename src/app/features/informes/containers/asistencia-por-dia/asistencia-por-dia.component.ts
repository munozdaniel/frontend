import { Component, OnInit } from '@angular/core';
import { designAnimations } from '@design/animations';

@Component({
  selector: 'app-asistencia-por-dia',
  templateUrl: './asistencia-por-dia.component.html',
  styleUrls: ['./asistencia-por-dia.component.scss'],
  animations: [designAnimations],

})
export class AsistenciaPorDiaComponent implements OnInit {
    titulo = 'Asistencias por día';
    cargando = false;
  constructor() { }

  ngOnInit(): void {
  }

}
