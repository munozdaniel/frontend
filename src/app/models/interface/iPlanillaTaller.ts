import { IAsignatura } from './iAsignatura';
import { IComision } from './iComision';
import { IProfesor } from './iProfesor';

export interface IPlanillaTaller {
  _id?: string;
  planillaTallerNro?: number;
  planillaTallerId?: number; // para migrar
  asignatura: IAsignatura | string;
  profesor: IProfesor | string;
  comision: IComision | string;
  // curso: number;
  // division: number;
  // comision: string;
  // cicloLectivo: number;
  fechaInicio: Date;
  fechaFinalizacion: Date;
  observacion?: string;
  bimestre: string;

  fechaCreacion?: Date;
  fechaModificacion?: Date;
  activo: boolean;
}
