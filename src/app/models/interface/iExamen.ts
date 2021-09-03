import { IAlumno } from './iAlumno';
import { IPlanillaTaller } from './iPlanillaTaller';

export interface IExamen {
  _id?: string;
  nota: number;
  mes: string;
  alumno: IAlumno;
  planilla: IPlanillaTaller;
  ausente?: boolean;
  fecha?: string;
}
