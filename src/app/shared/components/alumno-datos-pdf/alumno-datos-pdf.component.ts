import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { designAnimations } from '@design/animations';
import { IAlumno } from 'app/models/interface/iAlumno';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-alumno-datos-pdf',
  templateUrl: './alumno-datos-pdf.component.html',
  styleUrls: ['./alumno-datos-pdf.component.scss'],
  animations: [designAnimations],
})
export class AlumnoDatosPdfComponent implements OnInit {
  @Input() cargando: boolean;
  @Input() alumno: IAlumno;
  //   @ViewChild('alumno', null) message: ElementRef;

  constructor() {}

  ngOnInit(): void {}
}
