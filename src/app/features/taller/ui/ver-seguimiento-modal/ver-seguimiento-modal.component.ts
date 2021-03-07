import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ISeguimientoAlumno } from 'app/models/interface/iSeguimientoAlumno';

@Component({
  selector: 'app-ver-seguimiento-modal',
  templateUrl: './ver-seguimiento-modal.component.html',
  styleUrls: ['./ver-seguimiento-modal.component.scss'],
})
export class VerSeguimientoModalComponent implements OnInit {
  seguimiento: ISeguimientoAlumno;
  constructor(public dialogRef: MatDialogRef<VerSeguimientoModalComponent>, @Inject(MAT_DIALOG_DATA) public data: ISeguimientoAlumno) {
    this.seguimiento = data;
  }

  ngOnInit(): void {}
  cerrar() {
    this.dialogRef.close();
  }
}
