import { ICicloLectivo } from './iCicloLectivo';
import { ICurso } from './iCurso';

export interface IEstadoCursada {
  _id?: string;
  estadoCursadaNro?: number;
  curso: ICurso;
  condicion: string;
  cicloLectivo: ICicloLectivo;
  fechaCreacion: string;
  fechaModificacion?: Date;
  activo: boolean;
}
