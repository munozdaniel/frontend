import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-planilla-detalle-informes',
  templateUrl: './planilla-detalle-informes.component.html',
  styleUrls: ['./planilla-detalle-informes.component.scss'],
})
export class PlanillaDetalleInformesComponent implements OnInit {
  listaA = [
    {
      id: 1,
      titulo: 'Listado de Asistencias por Taller ',
      subtitulo: 'GENERAL',
    },
    {
      id: 2,
      titulo: 'Listado de Asistencias por Taller ',
      subtitulo: 'TALLER POR DÍA',
    },
    {
      id: 3,
      titulo: 'Listado de Calificaciones por Taller ',
      subtitulo: 'DETALLADO',
    },
    {
      id: 4,
      titulo: 'Listado de Calificaciones por Taller ',
      subtitulo: 'RESUMIDO',
    },
  ];
  listaB = [
    {
      id: 5,
      titulo: 'Seguimiento de Alumnos por Taller',
      subtitulo: 'GENERAL',
    },
    {
      id: 6,
      titulo: 'Libro de Temas',
      subtitulo: 'GENERAL',
    },
    {
      id: 7,
      titulo: 'Resumen de Taller por Alumnos',
      subtitulo: 'TUTORES',
    },
    {
      id: 8,
      titulo: 'Listado de Alumnos por Taller ',
      subtitulo: 'GENERAL',
    },
  ];
  constructor() {}

  ngOnInit(): void {}
  verInforme(id: number) {}
}
