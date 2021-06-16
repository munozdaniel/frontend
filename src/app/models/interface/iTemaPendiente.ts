import { IPlanillaTaller } from './iPlanillaTaller';
import { IProfesor } from './iProfesor';

export interface ITemaPendiente {
  _id?: string;
  planillaTaller: IPlanillaTaller;
  fecha: Date;
  profesor?: IProfesor;
}
