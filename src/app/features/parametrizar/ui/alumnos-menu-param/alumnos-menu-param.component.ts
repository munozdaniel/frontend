import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-alumnos-menu-param',
  templateUrl: './alumnos-menu-param.component.html',
  styleUrls: ['./alumnos-menu-param.component.scss'],
})
export class AlumnosMenuParamComponent implements OnInit {
  @Input() titulo: string = 'Alumnos';
  @Input() cargando: boolean;
  @Input() soloLectura: boolean;
  @Output() retHabilitarEdicion = new EventEmitter<boolean>();
  @Output() retAgregarAlumno = new EventEmitter<boolean>();

  constructor(private _permissionsService: NgxPermissionsService, private _router: Router) {}

  ngOnInit(): void {}
  editarAlumno() {
    this.retHabilitarEdicion.emit(true);
  }
  importarMasivo() {
    this._router.navigate(['/parametrizar/importar-alumnos']);
  }
  agregar() {
    this.retAgregarAlumno.emit(true);
  }
}
