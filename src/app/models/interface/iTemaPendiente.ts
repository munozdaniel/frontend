import { IPlanillaTaller } from './iPlanillaTaller';
import { IUsuario } from './iUsuario';

export interface ITemaPendiente {
  _id?: string;
  planillaTaller: IPlanillaTaller;
  fecha: Date;
  usuario: IUsuario;
}
