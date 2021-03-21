import { Component, OnInit } from '@angular/core';
import { designAnimations } from '@design/animations';
@Component({
  selector: 'app-taller-por-alumnos-tutores',
  templateUrl: './taller-por-alumnos-tutores.component.html',
  styleUrls: ['./taller-por-alumnos-tutores.component.scss'],
  animations: [designAnimations],
})
export class TallerPorAlumnosTutoresComponent implements OnInit {
  titulo = 'Taller por Alumnos (Tutores)';
  cargando = false;
  constructor() {}

  ngOnInit(): void {}
}
