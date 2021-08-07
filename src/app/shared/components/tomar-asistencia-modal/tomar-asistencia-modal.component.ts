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
      let f = fechaHoy;
      //   this.maximo = fechaHoy.toDate();
      //   La fecha de hoy es igual a la fecha de finalizacion?
      if (this.planillaTaller && fechaHoy.isSame(moment.utc(this.planillaTaller.fechaFinalizacion))) {
        f = moment.utc(this.planillaTaller.fechaFinalizacion).add(1, 'd');
        this.maximo = moment.utc(this.planillaTaller.fechaFinalizacion).add(1, 'd').toDate();
      } else {
        //   La fecha de hoy es MAYOR a la fecha de finalizacion?
        if (this.planillaTaller && !fechaHoy.isBefore(moment.utc(this.planillaTaller.fechaFinalizacion))) {
          f = moment.utc(this.planillaTaller.fechaFinalizacion).add(1, 'd');
          this.maximo = moment.utc(this.planillaTaller.fechaFinalizacion).add(1, 'd').toDate();
        } else {
          // La fecha de hoy es MENOR a la fecha de finalizacion
          this.maximo = fechaHoy.toDate();
        }
      }

      this.form = this._fb.group({
        fecha: [f.toDate(), [Validators.required]],
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
            let tomarAsistencia = 0;

            // ?0:(asistencias[index].presente===true ?1:((asistencias[index].presente===false && asistencias[index].ausentePermitido===false)? 2:3))
            if (index !== -1) {
              if (typeof asistencias[index].ausentePermitido !== 'boolean') {
                tomarAsistencia = 0;
              } else {
                tomarAsistencia =
                  asistencias[index].presente === true
                    ? 1
                    : asistencias[index].presente === false && asistencias[index].ausentePermitido === false
                    ? 2
                    : 3;
              }
              return {
                ...alumno,

                ausentePermitido: typeof asistencias[index].ausentePermitido === 'boolean' ? asistencias[index].ausentePermitido : false,
                // Verificar que si ausentePermitido es indefinido entonces es false
                presente: asistencias[index].presente,
                tarde: asistencias[index].llegoTarde,
                tomarAsistencia,
                // Setear tomarAsistencia segun lo que tenga seteado: Recordar que si viene un asuentePermitido indefinido entonce hay que ponerle 0
                //  sino verifacar si presente = true? 1 : ausentePermitido = false? 2 :3
              };
            } else {
              return { ...alumno, ausentePermitido: false, presente: null, tarde: false, tomarAsistencia: 0 };
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
    // console.log('¿ this.alumnos', this.alumnos);
    // console.log(
    //   '¿ this.alumnos',
    //   this.alumnos.filter((x) => x.presente !== null)
    // );
    const asistenciasTomadas: IAlumno[] = this.alumnos.map((x) => {
      if (x.tomarAsistencia === 1) {
        x.presente = true;
      }
      if (x.tomarAsistencia === 2) {
        x.presente = false;
        x.ausentePermitido = false;
      }
      if (x.tomarAsistencia === 3) {
        x.presente = false;
        x.ausentePermitido = true;
      }
      return x;
    });
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
        return this._asistenciaService
          .tomarAsistenciaPorPlanilla(this.planillaTaller, asistenciasTomadas, this.form.controls.fecha.value)
          .pipe(
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
          this._asistenciaService.buscarAsistenciasHoy(this.planillaTaller._id);
          this.cerrar();
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
    if (!this.dataSource.data) {
      return true; // disable true
    }
    const total = this.dataSource.data.length;
    const tomados = this.dataSource.data.filter((x) => x.tomarAsistencia === 1 || x.tomarAsistencia === 2 || x.tomarAsistencia === 3);
    return !(total === tomados.length);
  }
  toggleAsistencia(row) {
    if (row.tomarAsistencia > 2) {
      row.tomarAsistencia = 1;
    } else {
      row.tomarAsistencia++;
    }
  }
}
