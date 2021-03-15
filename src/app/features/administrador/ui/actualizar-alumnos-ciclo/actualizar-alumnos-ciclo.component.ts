import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { designAnimations } from '@design/animations';
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
  //   divisionSeleccionada: number;
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
  @Output() retBuscarAlumnos = new EventEmitter<{ curso: number; divisiones: number[]; cicloLectivo: number }>();
  @Output() retActualizarCiclo = new EventEmitter<{ cicloLectivo: number; curso: number; divisiones: number[] }>();
  @Output() retLimpiarAlumnos = new EventEmitter<boolean>();

  constructor(private _fb: FormBuilder) {}
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
    const actual = moment().year();
    this.form = this._fb.group({
      cicloLectivo: [actual, Validators.required],
      curso: [null, [Validators.required]],
      divisiones: [[]],
    });
    this.form.valueChanges.subscribe((val) => {
      if (val.divisiones) {
        if (val.divisiones.length < 1) {
          this.retLimpiarAlumnos.emit(true);
        } else {
          this.buscarAlumnos(val.divisiones);
        }
      }
    });
  }

  buscarAlumnos(divisiones: number[]) {
    if (this.form.valid) {
      //   this.divisionSeleccionada = division;
      const { curso, cicloLectivo } = this.form.value;
      this.retBuscarAlumnos.emit({ curso, divisiones, cicloLectivo });
    } else {
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Seleccione el Curso para poder visualizar los alumnos',
        icon: 'error',
      });
      return;
    }
  }
  actualizarCiclo() {
    if (this.form.valid) {
      const { curso, cicloLectivo, divisiones } = this.form.value;
      console.log('cicloLectivo, ', cicloLectivo);
      this.retActualizarCiclo.emit({ cicloLectivo, curso, divisiones });
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
