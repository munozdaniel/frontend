import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { designAnimations } from '@design/animations';
import { AlumnoService } from 'app/core/services/alumno.service';
import { ToastService } from 'app/core/services/general/toast.service';
import { IAlumno } from 'app/models/interface/iAlumno';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actualizar-alumnos-ciclo',
  templateUrl: './actualizar-alumnos-ciclo.component.html',
  styleUrls: ['./actualizar-alumnos-ciclo.component.scss'],
  animations: [designAnimations],
})
export class ActualizarAlumnosCicloComponent implements OnInit, OnChanges {
  cursos = [1, 2, 3, 4, 5, 6];
  divisiones = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  anios = [];
  form: FormGroup;
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild('sort') set setSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild('paginator') set setPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  columnas = ['nombreCompleto'];
  @Input() cargando: boolean;
  @Input() alumnos: IAlumno[];
  @Output() retBuscarAlumnos = new EventEmitter<{ cicloLectivo: number; curso: number; division: number }>();
  @Output() retActualizarCiclo = new EventEmitter<{ cicloLectivo: number; curso: number; divisiones: number[] }>();
  constructor(private _fb: FormBuilder) {
    const actual = moment().year();
    for (let index = 10; index > 0; index--) {
      this.anios.unshift(actual - index);
    }
    this.anios.unshift(actual);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.alumnos && changes.alumnos.currentValue) {
      this.dataSource.data = this.alumnos;
    }
  }
  filtroRapido(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  ngOnInit(): void {
    this.form = this._fb.group({
      cicloLectivo: [null, Validators.required],
      curso: [null, [Validators.required]],
    });
  }
  buscarAlumnos(division: number) {
    if (this.form.valid) {
      const { curso, cicloLectivo } = this.form.value;
      this.retBuscarAlumnos.emit({ cicloLectivo, curso, division });
    } else {
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Seleccione el Ciclo Lectivo y el Curso para poder visualizar los alumnos',
        icon: 'error',
      });
      return;
    }
  }
  actualizarCiclo() {
    if (this.form.valid) {
      const { curso, cicloLectivo } = this.form.value;
      this.retActualizarCiclo.emit({ cicloLectivo, curso, divisiones: this.divisiones });
    } else {
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Seleccione el Ciclo Lectivo y el Curso para poder visualizar los alumnos',
        icon: 'error',
      });
      return;
    }
  }
}
