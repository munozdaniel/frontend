import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UsuarioService } from 'app/core/services/helpers/usuario.service';
import { ProfesorService } from 'app/core/services/profesor.service';
import { PROFESOR_KEY, IProfesor } from 'app/models/interface/iProfesor';
import { IUsuario } from 'app/models/interface/iUsuario';
import { Observable, of } from 'rxjs';
import { delay, map, startWith, switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';
@UntilDestroy()
@Component({
  selector: 'app-asignar-profesor',
  templateUrl: './asignar-profesor.component.html',
  styleUrls: ['./asignar-profesor.component.scss'],
})
export class AsignarProfesorComponent implements OnInit {
  pairKeyProfesor = PROFESOR_KEY;
  profesores$: Observable<IProfesor[]>;
  form: FormGroup;
  usuario: IUsuario;
  profesores: IProfesor[];
  cargandoProfesores: boolean;

  constructor(
    private _profesorService: ProfesorService,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<AsignarProfesorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IUsuario,
    private _usuarioService: UsuarioService
  ) {
    this.usuario = data;
  }

  ngOnInit(): void {
    this.buscarProfesores();
  }
  buscarProfesores() {
    this.cargandoProfesores = true;
    this._profesorService
      .obtenerProfesoresHabilitadas()
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          this.cargandoProfesores = false;
          this.profesores = datos;
          this.form = this._fb.group({
            profesor: [null, [Validators.required]],
          });
          this._configurarProfesoresAutocomplete(this.profesores);
        },
        (error) => {
          this.cargandoProfesores = false;
          console.log('[ERROR]', error);
        }
      );
  }
  _configurarProfesoresAutocomplete(profesoresList: IProfesor[]) {
    this.profesores$ = this.form.get('profesor').valueChanges.pipe(
      startWith(null),
      switchMap((name) => {
        if (typeof name === 'string') {
          return of(profesoresList).pipe(
            delay(800),
            map((response) => response.filter((p) => p.nombreCompleto.toUpperCase().includes(name)))
          );
        }
        return of([]);
      })
    );
  }
  guardarUsuarioConProfesor() {
    if (this.form.invalid) {
      Swal.fire({
        title: 'Datos incorrectos',
        text: 'Verifique que el profesor seleccionado se encuentre en la lista',
        icon: 'error',
        timer: 2000,
        timerProgressBar: true,
      }).then(() => {});
    } else {
      this._usuarioService
        .asignarProfesor(this.usuario._id, this.form.controls.profesor.value)
        .pipe(untilDestroyed(this))
        .subscribe(
          (datos) => {
            Swal.fire({
              title: 'Operación exitosa',
              text: 'El profesor ha sido asignado al usuario',
              icon: 'success',
              timer: 2000,
              timerProgressBar: true,
            }).then(() => {
              this.dialogRef.close();
            });
          },
          (error) => {
            console.log('[ERROR]', error);
          }
        );
    }
  }
  quitarProfesor() {
    this._usuarioService
      .quitarProfesor(this.usuario._id)
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          Swal.fire({
            title: 'Operación exitosa',
            text: 'El profesor ha sido desvinculado al usuario',
            icon: 'success',
            timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            this.dialogRef.close(true);
          });
        },
        (error) => {
          console.log('[ERROR]', error);
        }
      );
  }
}
