import { Component, OnInit } from '@angular/core';
import { designAnimations } from '@design/animations';
@Component({
  selector: 'app-calificaciones-por-taller-resumen',
  templateUrl: './calificaciones-por-taller-resumen.component.html',
  styleUrls: ['./calificaciones-por-taller-resumen.component.scss'],
  animations: [designAnimations],
})
export class CalificacionesPorTallerResumenComponent implements OnInit {
    titulo = 'Calificaciones por Taller (Resumen)';
    cargando = false;
  constructor() { }

  ngOnInit(): void {
  }

}
