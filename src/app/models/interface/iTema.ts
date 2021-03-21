import { IPlanillaTaller } from './iPlanillaTaller';

export interface ITema {
  _id: string;
  temaNro: number;
  id_planilla_temas: number; // solo para migrar
  planillaTaller: IPlanillaTaller;
  fecha: Date;
  temaDelDia: string;
  tipoDesarrollo: string;
  temasProximaClase: string;
  nroClase: number;
  unidad: number;
  caracterClase: string;
  observacionJefe: string;

  fechaCreacion?: Date;
  fechaModificacion?: Date;
  activo: boolean;

  //
  incompleto?: boolean;
}
