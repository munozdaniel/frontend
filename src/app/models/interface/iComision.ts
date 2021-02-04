export interface IComision {
  _id: string;
  comisionNro: number;
  comision: string;
  alumnoId?: string;
  cicloLectivo: number;
  curso: number;
  division: number;
  // condicion:string;

  fechaCreacion?: Date;
  fechaModificacion?: Date;
  activo: boolean;

  index?: number; // ejecucion
}
