import { IAsignatura } from './iAsignatura';
import { IComision } from './iComision';
import { IProfesor } from './iProfesor';

export interface IPlanillaTaller {
  _id: string;
  planillaTallerNro: number;
  planillaTallerId: number; // para migrar
  asignaturaId: IAsignatura;
  profesorId: IProfesor;
  comision: IComision;
  fechaInicio: Date;
  fechaFinalizacion: Date;
  observacion: string;
  bimestre: string;

  fechaCreacion?: Date;
  fechaModificacion?: Date;
  activo: boolean;
}
