import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatPaginator, MatSort, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { designAnimations } from '@design/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
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
  minimo;
  maximo;
  deshabilitadoTemporalmente = false;
  form: FormGroup;
  isMobile = false;
  constructor(
    private _fb: FormBuilder,
    private _asistenciaService: AsistenciaService,
    public dialogRef: MatDialogRef<TomarAsistenciaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.isMobile = data.isMobile;
      this.planillaTaller = data.planillaTaller;
      //   this.dataSource.data = this.alumnos = data.alumnos.map((x) => ({ ...x, presente: null }));
      this.alumnos = data.alumnos;
      this.minimo = new Date(this.planillaTaller.fechaInicio);
      const fechaHoy = moment();
      if (moment.utc(this.planillaTaller.fechaInicio).isAfter(moment.utc())) {
        this.deshabilitadoTemporalmente = true;
      }
      this.maximo = fechaHoy.toDate();
      let f = fechaHoy;
      if (this.planillaTaller && !fechaHoy.isSameOrBefore(moment.utc(this.planillaTaller.fechaFinalizacion))) {
        f = moment.utc(this.planillaTaller.fechaFinalizacion);
        this.maximo = new Date(this.planillaTaller.fechaFinalizacion);
      }
      this.form = this._fb.group({
        fecha: [f.utc().toDate(), [Validators.required]],
      });
      this.obtenerAsistenciasDeLaFecha(f.toDate());
      this.form
        .get('fecha')
        .valueChanges.pipe(untilDestroyed(this))
        .subscribe(
          (datos) => {
            this.obtenerAsistenciasDeLaFecha(datos);
          },
          (error) => {
            console.log('[ERROR]', error);
          }
        );
    }
  }
  obtenerAsistenciasDeLaFecha(fecha) {
    this._asistenciaService
      .buscarAsistenciasPorFechaYPlanilla(fecha, this.planillaTaller, this.alumnos)
      .pipe(untilDestroyed(this))
      .subscribe(
        (asistencias) => {
          this.dataSource.data = this.alumnos = this.alumnos.map((alumno) => {
            const index = asistencias.findIndex((asistencia) => asistencia.alumno.toString() === alumno._id.toString());
            if (index !== -1) {
              return { ...alumno, presente: asistencias[index].presente, tarde: asistencias[index].llegoTarde };
            } else {
              return { ...alumno, presente: null, tarde: false };
            }
          });
        },
        (error) => {
          console.log('[ERROR]', error);
        }
      );
  }
  cerrar(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {}
  tomarAsistenciaMasivo() {
    const fecha = moment(this.form.controls.fecha.value).format('DD/MM/YYYY');
    Swal.fire({
      title: '¿Está seguro de continuar?',
      html: 'Se sobreescribirán las asistencias de la fecha ' + fecha + ' si es que ya existen.',
      icon: 'warning',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this._asistenciaService.tomarAsistenciaPorPlanilla(this.planillaTaller, this.alumnos, this.form.controls.fecha.value).pipe(
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
  controlAsistencias() {
    if (!this.alumnos) {
      return true; // disable true
    }
    const total = this.alumnos.length;
    const tomados = this.alumnos.filter((x) => x.presente === true || x.presente === false);
    return !(total === tomados.length);
  }
}
