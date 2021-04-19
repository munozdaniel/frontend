import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatPaginator, MatSort, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { designAnimations } from '@design/animations';
import { UntilDestroy } from '@ngneat/until-destroy';
import { AsistenciaService } from 'app/core/services/asistencia.service';
import { IAlumno } from 'app/models/interface/iAlumno';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import * as moment from 'moment';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
@UntilDestroy()
@Component({
  selector: 'app-tomar-asistencia-modal',
  templateUrl: './tomar-asistencia-modal.component.html',
  styleUrls: ['./tomar-asistencia-modal.component.scss'],
  animations: [designAnimations],
})
export class TomarAsistenciaModalComponent implements OnInit {
  cargando = false;
  fecha = moment().format('DD/MM/YYYY');
  planillaTaller: IPlanillaTaller;
  alumnos: IAlumno[];
  //   Alumnos
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild('sort') set setSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild('paginator') set setPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  columnas = ['nombreCompleto', 'ausente', 'tarde'];

  constructor(
    private _asistenciaService: AsistenciaService,
    public dialogRef: MatDialogRef<TomarAsistenciaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.planillaTaller = data.planillaTaller;
      this.dataSource.data = this.alumnos = data.alumnos;
    }
  }

  cerrar(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {}
  tomarAsistenciaMasivo() {
    Swal.fire({
      title: '¿Está seguro de continuar?',
      html: 'Se sobreescribirán las asistencias de la fecha ' + this.fecha + ' si es que ya existen.',
      icon: 'warning',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this._asistenciaService.tomarAsistenciaPorPlanilla(this.planillaTaller, this.alumnos, this.fecha).pipe(
          catchError((error) => {
            console.log('[ERROR]', error);
            Swal.fire({
              title: 'Oops! Ocurrió un error',
              text: error && error.error ? error.error.message : 'Error de conexion',
              icon: 'error',
            });
            return of(error);
          })
        );
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result: any) => {
      if (result.isConfirmed) {
        console.log('result1', result);
        if (result.value) {
          Swal.fire({
            title: 'Operación Exitosa',
            text: 'Las asistencias se han actualizado  correctamente.',
            icon: 'success',
          });
        } else {
          Swal.fire({
            title: 'Oops! Ocurrió un error',
            text: 'Intentelo nuevamente. Si el problema persiste comuniquese con el soporte técnico.',
            icon: 'error',
          });
        }
      }
    });
  }
}
