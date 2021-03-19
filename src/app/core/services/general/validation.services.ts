import { AbstractControl, FormGroup, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  constructor() {}
  /**
   * Gestionar los mensajes
   */
  static error(validatorName: string, validatorValue?: any) {
    const config = {
      desdeMenorHasta: 'La fecha inicial debe ser mayor a la final',
      required: 'Campo Requerido',
      invalidPassword: 'Invalid password. Password must be at least 6 characters long, and contain a number.',
      minlength: `Longitud Mínima ${validatorValue.requiredLength}`,
      maxlength: `Longitud Máxima ${validatorValue.requiredLength}`,
      menorEstrictoA: 'El primer valor no puede ser igual o superior al segundo',
      min: `El número debe ser mayor a ${validatorValue.min}`,
      alMenosUnTelefono: 'Al menos un teléfono es obligatorio',
      empresaOUsuario: 'Seleccione una empresa o un ingrese un dato de usuario',
      existeEmail: 'Este email ya está en uso, por favor utilice otro.',
      existeLogin: 'Este nombre de usuario ya está en uso, por favor utilice otro.',
      alMenosUnItemEnElArreglo: 'Debe seleccionar al menos un item.',
      esEntidad: 'No corresponde a un item de la lista',
    };

    return config[validatorName];
  }

  /** --------------------------------------------------------------------------
   * VALIDADORES COMPUESTOS
   * Metodo para capturar el error:
   * <mat-error *ngIf="ejemploForm.errors?.desdeMenorHasta">
   *         La fecha inicial no puede ser mayor a la final
   * </mat-error>
   *
   */
  static esEntidad(control: AbstractControl) {
    if (control.value && control.value.length > 0 && typeof control.value === 'string') {
      return { esEntidad: true };
    }
    return null;
  }
  static alMenosUnItemEnElArreglo(control: AbstractControl) {
    if (!control.value) {
      return { alMenosUnItemEnElArreglo: true };
    }
    if (control.value.length > 0) {
      return null;
    } else {
      return { alMenosUnItemEnElArreglo: true };
    }
  }
  static alMenosUno(uno: string, dos: string) {
    return (group: FormGroup): { [key: string]: any } => {
      const vUno = group.controls[uno];
      const vDos = group.controls[dos];
      if ((!vUno.value || vUno.value.toString().trim() === '') && (!vDos.value || vDos.value.toString().trim() === '')) {
        return { alMenosUnTelefono: true };
      }
      return {};
    };
  }
  static alMenosUnVerdadero(uno: string, dos: string) {
    return (group: FormGroup): { [key: string]: any } => {
      const vUno = group.controls[uno];
      const vDos = group.controls[dos];
      if (!vUno.value && !vDos.value) {
        return { alMenosUnTelefono: true };
      }
      return {};
    };
  }
  /**
   * Metodo especifico para determinar si al menos uno de los dos campos fueron seleccionados.
   * Ejemplo: Necesito que una empresa (autocomplete) sea seleccionada o un usuario (string) sea ingresado
   */
  static empresaOUsuario(campo1: string, campo2: string, id1: string) {
    return (group: FormGroup): { [key: string]: any } => {
      const campoControl1 = group.controls[campo1];
      const campoControl2 = group.controls[campo2];
      if ((!campoControl1.value || !campoControl1.value[id1]) && (!campoControl2.value || campoControl2.value.toString().trim() === '')) {
        return { empresaOUsuario: true };
      }

      return {};
    };
  }

  /**
   * Verifica que una fecha sea menor a otra
   * @param desde
   * @param hasta
   */
  static desdeMenorHasta(desde: string, hasta: string) {
    return (group: FormGroup): { [key: string]: any } => {
      // if ( group.controls.value == null) {
      //     return null;
      // }
      const f = group.controls[desde];
      const t = group.controls[hasta];
      if (!f || f.value == null) {
        return {};
      }
      if (!t || t.value == null) {
        return {};
      }
      // if ((date1 !== null && date2 !== null) && date1 > date2) {
      if (f.value > t.value) {
        return { desdeMenorHasta: true };
      }
      return {};
    };
  }
  static desdeMenorEstrictoHasta(desde: string, hasta: string) {
    return (group: FormGroup): { [key: string]: any } => {
      // if ( group.controls.value == null) {
      //     return null;
      // }
      const f = group.controls[desde];
      const t = group.controls[hasta];
      if (!f || f.value == null) {
        return {};
      }
      if (!t || t.value == null) {
        return {};
      }
      // if ((date1 !== null && date2 !== null) && date1 > date2) {
      if (f.value >= t.value) {
        return { desdeMenorEstrictoHasta: true };
      }
      return {};
    };
  }
  /**
   * Verifica que un numero sea menor a otro
   * arg0<arg1
   */
  static menorEstrictoA(arg0: string, arg1: string) {
    return (group: FormGroup): { [key: string]: any } => {
      const vUno = group.controls[arg0];
      const vDos = group.controls[arg1];
      if (vUno.value >= vDos.value) {
        return { menorEstrictoA: true };
      }
      return {};
    };
  }
  static sinEspacios(control: AbstractControl): ValidationErrors | null {
    if (!control || !control.value) {
      return null;
    }
    if ((control.value as string).indexOf(' ') >= 0) {
      return { sinEspacios: true };
    }

    return null;
  }
  static sinCaracteresEspeciales(control: AbstractControl): ValidationErrors | null {
    if (!control || !control.value) {
      return null;
    }

    if (!control.value.match('^[\u00f1\u00d1A-Za-z0-9]+$')) {
      // if ( !control.value.match('[a-zA-Z0-9\u00f1\u00d1]*')) {
      return { sinCaracteresEspeciales: true };
    }

    return null;
  }
  static soloNumeros(control: AbstractControl) {
    if (!control.value) {
      return null;
    }
    if (control.value.match('^[0-9]*$')) {
      return null;
    } else {
      return { soloNumeros: true };
    }
  }

  /**
   * Ejemplo
   * @param control
   */
  static passwordValidator(control) {
    if (!control.value) {
      return null;
    }
    // {6,100}           - Assert password is between 6 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
      return null;
    } else {
      return { invalidPassword: true };
    }
  }

  // checkIfUsernameExists(username: string): Observable<boolean> {
  //   return of(this.takenUsernames.includes(username)).pipe(delay(1000));
  // }
}
