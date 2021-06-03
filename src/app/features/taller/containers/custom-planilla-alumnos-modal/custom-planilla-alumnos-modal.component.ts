import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AlumnoService } from 'app/core/services/alumno.service';
import { IAlumno } from 'app/models/interface/iAlumno';
import { IAlumnoTaller } from 'app/models/interface/iAlumnoTaller';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
@UntilDestroy()
@Component({
  selector: 'app-custom-planilla-alumnos-modal',
  templateUrl: './custom-planilla-alumnos-modal.component.html',
  styleUrls: ['./custom-planilla-alumnos-modal.component.scss'],
  animations: designAnimations,
})
export class CustomPlanillaAlumnosModalComponent implements OnInit {
  planillaTaller: IPlanillaTaller;
  cargando = false;
  //
  alumnos: IAlumnoTaller[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild('sort') set setSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild('paginator') set setPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  columnas: string[] = ['nombre', 'opciones'];
  seleccionA = new SelectionModel<IAlumnoTaller>(true, []);

  constructor(
    private _alumnoService: AlumnoService,
    public dialogRef: MatDialogRef<CustomPlanillaAlumnosModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.planillaTaller = data.planillaTaller;
      this.obtenerAlumnos();
    }
  }

  ngOnInit(): void {}
  filtroRapido(evento) {}
  obtenerAlumnos() {
    this.cargando = true;
    this._alumnoService
      .obtenerAlumnosPorPlanillaPersonalizada(this.planillaTaller._id)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.cargando = false;
          this.alumnos = [...datos];
          this.dataSource.data = this.alumnos;
          this.dataSource.filteredData.forEach((row) => (row.selected ? this.seleccionA.select(row) : null));
          this.dataSource.filter = '';
        },
        (error) => {
          this.cargando = false;
          console.log('[ERROR]', error);
        }
      );
  }
  /** Operacion checkbox A */
  todosSeleccionadosA() {
    const numSelected = this.seleccionA.selected.length;
    const numRows = this.dataSource.filteredData.length;
    return numSelected === numRows;
  }
  /** Operacion checkbox A */
  masterToggleA() {
    this.todosSeleccionadosA() ? this.seleccionA.clear() : this.dataSource.filteredData.forEach((row) => this.seleccionA.select(row));
  }
  seleccionar(row: IAlumnoTaller) {
    this.seleccionA.toggle(row);
  }
  guardarAlumnosEspeciales() {
    const alumnosTaller: IAlumnoTaller[] = this.seleccionA.selected;
    this._alumnoService
      .guardarAlumnosEspeciales(alumnosTaller, this.planillaTaller._id)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.obtenerAlumnos();
        },
        (error) => {
          console.log('[ERROR]', error);
        }
      );
  }
}
