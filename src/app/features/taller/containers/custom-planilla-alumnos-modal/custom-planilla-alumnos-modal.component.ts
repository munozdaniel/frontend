import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource, MatSort, MatPaginator, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AlumnoService } from 'app/core/services/alumno.service';
import { CicloLectivoService } from 'app/core/services/ciclo-lectivo.service';
import { IAlumnoTaller } from 'app/models/interface/iAlumnoTaller';
import { ICicloLectivo } from 'app/models/interface/iCicloLectivo';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import Swal from 'sweetalert2';
@UntilDestroy()
@Component({
  selector: 'app-custom-planilla-alumnos-modal',
  templateUrl: './custom-planilla-alumnos-modal.component.html',
  styleUrls: ['./custom-planilla-alumnos-modal.component.scss'],
  animations: designAnimations,
})
export class CustomPlanillaAlumnosModalComponent implements OnInit {
  form: FormGroup;
  tiposComision = [null, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  planillaTaller: IPlanillaTaller;
  cargando = false;
  //
  alumnosTaller: IAlumnoTaller[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild('sort') set setSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild('paginator') set setPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  columnas: string[] = ['nombre', 'opciones'];
  seleccionA = new SelectionModel<IAlumnoTaller>(true, []);
  ciclosLectivos: ICicloLectivo[] = [];

  constructor(
    private _fb: FormBuilder,
    private _alumnoService: AlumnoService,
    public dialogRef: MatDialogRef<CustomPlanillaAlumnosModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _cicloLectivoService: CicloLectivoService
  ) {
    if (data) {
      this.planillaTaller = data.planillaTaller;
      this.obtenerAlumnos();
    }
  }

  ngOnInit(): void {
    this._cicloLectivoService
      .obtenerCiclosLectivos()
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.cargando = false;
          this.ciclosLectivos = datos;
          this.form = this._fb.group({
            curso: [null, [Validators.required]],
            division: [null, [Validators.required]],
            cicloLectivo: [null, [Validators.required]],
          });
        },
        (error) => {
          this.cargando = false;
          console.log('[ERROR]', error);
        }
      );
  }
  setBuscarPlanilla() {
    this.cargando = true;
    const { curso, division, cicloLectivo } = this.form.value;
    this._alumnoService
      .obtenerAlumnosTallerPorCursoEspecifico(this.planillaTaller, curso, division, cicloLectivo)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.cargando = false;
          this.alumnosTaller = datos;
          this.dataSource.data = this.alumnosTaller;
          this.dataSource.filteredData.forEach((row) => (row.selected ? this.seleccionA.select(row) : null));
          this.dataSource.filter = '';
        },
        (error) => {
          this.cargando = false;
          console.log('[ERROR]', error);
        }
      );
  }
  filtroRapido(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  obtenerAlumnos() {
    this.cargando = true;
    this._alumnoService
      .obtenerAlumnosPorPlanillaPersonalizada(this.planillaTaller._id)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.cargando = false;
          this.alumnosTaller = [...datos];
          this.dataSource.data = this.alumnosTaller;
          this.dataSource.filteredData.forEach((row) => (row.selected ? this.seleccionA.select(row) : null));
          this.dataSource.filter = '';
          this.customSearchSortTable();
        },
        (error) => {
          this.cargando = false;
          console.log('[ERROR]', error);
        }
      );
  }
  customSearchSortTable() {
    // Personalizar funcion busqueda en la tabla detalle
    this.dataSource.filterPredicate = (data: IAlumnoTaller, filters: string) => {
      const matchFilter = [];
      const filterArray = filters.split(',');
      const columns = [data.alumno.nombreCompleto];

      filterArray.forEach((filter) => {
        const customFilter = [];
        columns.forEach((column) => {
          if (column) {
            customFilter.push(column.toString().toLowerCase().includes(filter));
          }
        });
        matchFilter.push(customFilter.some(Boolean)); // OR
      });
      return matchFilter.every(Boolean); // AND
    };

    this.dataSource.sortingDataAccessor = (item: IAlumnoTaller, property) => {
      switch (property) {
        case 'nombre':
          return item.alumno.nombreCompleto ? item.alumno.nombreCompleto.toString() : '';

        default:
          return item[property];
      }
    };
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
    this.cargando = true;
    const alumnosTaller: IAlumnoTaller[] = this.seleccionA.selected;
    this._alumnoService
      .guardarAlumnosEspeciales(alumnosTaller, this.planillaTaller._id)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.cargando = false;

          //   this.obtenerAlumnos();
          if (datos.success) {
            if (datos.planillaTaller) {
              this.planillaTaller = { ...datos.planillaTaller };
            }
            Swal.fire({
              title: 'Operación exitosa',
              text: datos.message,
              icon: 'success',
              timer: 2000,
              timerProgressBar: true,
            }).then(() => {
              this.dialogRef.close();
            });
          }
        },
        (error) => {
          this.cargando = false;

          console.log('[ERROR]', error);
        }
      );
  }
}
