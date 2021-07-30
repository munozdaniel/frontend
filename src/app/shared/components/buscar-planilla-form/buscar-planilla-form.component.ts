import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CicloLectivoService } from 'app/core/services/ciclo-lectivo.service';
import { ICicloLectivo } from 'app/models/interface/iCicloLectivo';
import * as moment from 'moment';
import Swal from 'sweetalert2';
@UntilDestroy()
@Component({
  selector: 'app-buscar-planilla-form',
  templateUrl: './buscar-planilla-form.component.html',
  styleUrls: ['./buscar-planilla-form.component.scss'],
})
export class BuscarPlanillaFormComponent implements OnInit {
  @Input() cargando: boolean;
  form: FormGroup;
  tiposComision = [0, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  @Output() retBuscarPlanilla = new EventEmitter<any>();
  ciclos: ICicloLectivo[] = [];
  constructor(private _fb: FormBuilder, private _cicloLectivoService: CicloLectivoService) {}

  ngOnInit(): void {
    this.cargando = true;
    // Deberia hacerlo en el padre. Pero no quiero
    this._cicloLectivoService
      .obtenerCiclosLectivos()
      .pipe(untilDestroyed(this))
      .subscribe(
        (datos) => {
          const now = new Date();
          const hoy: string = moment(now).format('YYYY');
          this.cargando = false;
          this.ciclos = datos;
          const anoActual = datos.find((x) => x.anio === Number(hoy));
          this.form = this._fb.group({
            curso: [null, [Validators.required]],
            comision: [null, [Validators.required]],
            division: [null, [Validators.required]],
            cicloLectivo: [anoActual, [Validators.required]],
          });
        },
        (error) => {
          this.cargando = false;
          console.log('[ERROR]', error);
        }
      );
  }
  enviarParametros() {
    if (this.form.invalid) {
      Swal.fire({
        title: 'Oops! Datos incorrectos',
        text: 'El formulario no está completo. Verifique sus datos.',
        icon: 'error',
      });
      return;
    }
    const parametros = {
      ...this.form.value,
      curso: Number(this.form.controls.curso.value),
      division: Number(this.form.controls.division.value),
    };

    this.retBuscarPlanilla.emit(parametros);
  }
}
