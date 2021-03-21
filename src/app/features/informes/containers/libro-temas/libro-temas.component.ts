import { Component, OnInit } from '@angular/core';
import { designAnimations } from '@design/animations';
@Component({
  selector: 'app-libro-temas',
  templateUrl: './libro-temas.component.html',
  styleUrls: ['./libro-temas.component.scss'],
  animations: [designAnimations],
})
export class LibroTemasComponent implements OnInit {
    titulo = 'Libro de Temas';
    cargando = false;
  constructor() { }

  ngOnInit(): void {
  }

}
