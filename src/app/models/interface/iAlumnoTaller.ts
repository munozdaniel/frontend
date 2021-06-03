import { IAlumno } from './iAlumno';
import { IPlanillaTaller } from './iPlanillaTaller';

export interface IAlumnoTaller {
  alumno: IAlumno;
  planillaTaller: IPlanillaTaller;
  //
  selected?: boolean;
}
