import { Component, OnInit } from '@angular/core';
import { designAnimations } from '@design/animations';
@Component({
  selector: 'app-asistencia-por-taller',
  templateUrl: './asistencia-por-taller.component.html',
  styleUrls: ['./asistencia-por-taller.component.scss'],
  animations: [designAnimations],
})
export class AsistenciaPorTallerComponent implements OnInit {
  titulo = 'Asistencias por Taller';
  cargando = false;
  constructor() {}

  ngOnInit(): void {}
}
