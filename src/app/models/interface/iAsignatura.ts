export interface IAsignatura {
  _id: string;
  asignaturaNro:number;
  detalle: string;
  tipoAsignatura: string;
  tipoCiclo: string;
  tipoFormacion: string;
  curso: number;
  meses: number;
  horasCatedraAnuales: number;
  horasCatedraSemanales: number;

  fechaCreacion: Date;
  fechaModificacion?: Date;
  activo: boolean;
}
