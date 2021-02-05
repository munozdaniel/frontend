import { IAsignatura } from './iAsignatura';
import { IComision } from './iComision';
import { IProfesor } from './iProfesor';

export interface IPlanillaTaller {
  _id?: string;
  planillaTallerNro: number;
  planillaTallerId: number; // para migrar
  asignatura: IAsignatura;
  profesor: IProfesor;
  comision: IComision;
  // curso: number;
  // division: number;
  // comision: string;
  // cicloLectivo: number;
  fechaInicio: Date;
  fechaFinalizacion: Date;
  observacion: string;
  bimestre: string;

  fechaCreacion?: Date;
  fechaModificacion?: Date;
  activo: boolean;
}
