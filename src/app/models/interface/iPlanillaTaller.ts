import { IAsignatura } from './iAsignatura';
import { ICicloLectivo } from './iCicloLectivo';
import { ICurso } from './iCurso';
import { IProfesor } from './iProfesor';

export interface IPlanillaTaller {
  _id?: string;
  planillaTallerNro?: number;
  planillaTallerId?: number; // para migrar
  asignatura: IAsignatura;
  profesor: IProfesor;
  curso: ICurso;
  // curso: number;
  // division: number;
  // comision: string;
  cicloLectivo: ICicloLectivo;
  fechaInicio: Date;
  fechaFinalizacion: Date;
  observacion?: string;
  bimestre: string;

  fechaCreacion?: Date;
  fechaModificacion?: Date;
  activo: boolean;
}
