import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-agregar-cursada',
  templateUrl: './agregar-cursada.component.html',
  styleUrls: ['./agregar-cursada.component.scss'],
})
export class AgregarCursadaComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<AgregarCursadaComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {}
  cerrar(): void {
    this.dialogRef.close();
  }
}
