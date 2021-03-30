import { MediaMatcher, BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { designAnimations } from '@design/animations';
import { ISeguimientoAlumno } from 'app/models/interface/iSeguimientoAlumno';
import { CONFIG_PROVIDER } from 'app/shared/config.provider';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-seguimiento-form',
  templateUrl: './seguimiento-form.component.html',
  styleUrls: ['./seguimiento-form.component.scss'],
  animations: [designAnimations],
  providers: CONFIG_PROVIDER,
})
export class SeguimientoFormComponent implements OnInit, OnChanges {
  panelOpenState = true;
  @Input() cargando: boolean;
  @Input() seguimiento: ISeguimientoAlumno;
  @Output() retActualizar = new EventEmitter<ISeguimientoAlumno>();
  minimo;
  maximo;
  form: FormGroup;
  isUpdate = true;
  // Mobile
  expandedElement: ISeguimientoAlumno | null;
  isMobile: boolean;
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  constructor(
    private _fb: FormBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
    private _media: MediaMatcher,
    public breakpointObserver: BreakpointObserver
  ) {
    this.mobileQuery = this._media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this._changeDetectorRef.detectChanges();
    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.HandsetPortrait]).subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.seguimiento && changes.seguimiento.currentValue) {
      this.setFormulario();
    }
  }

  ngOnInit(): void {
    const fechaHoy = moment();
    let f = fechaHoy;

    this.form = this._fb.group({
      fecha: [f, [Validators.required]],
      alumno: [null, [Validators.required]],
      planillaTaller: [null, []],
      cicloLectivo: [null, [Validators.required]],
      tipoSeguimiento: [null, [Validators.required, Validators.minLength(7), Validators.maxLength(100)]],
      resuelto: [null, []],
      observacion: [null, [Validators.required, Validators.minLength(7), Validators.maxLength(100)]],
      observacion2: [null, [Validators.minLength(7), Validators.maxLength(100)]],
      observacionJefe: [null, [Validators.minLength(7), Validators.maxLength(100)]],
      fechaCreacion: [null, Validators.required],
      activo: [true, [Validators.required]],
    });
  }
  setFormulario() {
    if (!this.form) {
      setTimeout(() => {
        this.setFormulario();
      }, 1000);
    } else {
      this.form.patchValue(this.seguimiento);
    }
  }
  actualizar() {
    if (!this.form.valid) {
      Swal.fire({
        title: 'Error en el Formulario',
        text: 'Verifique de haber ingresado todos los datos requeridos en el formulario de seguimiento.',
        icon: 'error',
      });
      return;
    }
    this.retActualizar.emit(this.form.value);
  }
}
