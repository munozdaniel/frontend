import { Component, OnInit } from '@angular/core';
import { designAnimations } from '@design/animations';
@Component({
  selector: 'app-calificaciones-por-taller',
  templateUrl: './calificaciones-por-taller.component.html',
  styleUrls: ['./calificaciones-por-taller.component.scss'],
  animations: [designAnimations],
})
export class CalificacionesPorTallerComponent implements OnInit {
    titulo = 'Calificaciones por Taller';
    cargando = false;
  constructor() { }

  ngOnInit(): void {
  }

}
