import { ICicloLectivo } from './iCicloLectivo';

export interface ICurso {
  _id: string;
  cursoNro: number;
  curso: number;
  comision: string;
  alumnoId?: string;
  //   cicloLectivo:number;
  cicloLectivo: ICicloLectivo[];
  division: number;

  fechaCreacion?: Date;
  fechaModificacion?: Date;
  activo: boolean;
}
