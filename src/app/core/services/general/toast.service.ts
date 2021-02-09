import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toast: any;
  constructor() {
    this.toast = Swal.mixin({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
  }
  getToast() {
    return this.toast;
  }
  sinRegistros() {
    this.toast.fire({
      icon: 'error',
      title: 'No se encontraron registros',
    });
  }
  operacionExitosa() {
    this.toast.fire({
      icon: 'success',
      title: 'Operación Exitosa',
    });
  }
}
