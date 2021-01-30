export interface ISeguimientoAlumno {
  _id?: number;
  id_alumno: number;
  fecha: string;
  tipoSeguimiento: string;
  observacion: string;
  cicloLectivo: number;
  idPlanillaDeTaller: number;
  resuelto: string;
  observacion2: string;
  observacionJefe: string;
}
// original
// _id: number;
// id_seguimiento: number;
// id_alumno: number;
// fecha: string;
// tipo_seguimiento: string;
// observacion: string;
// ciclo_lectivo: number;
// IdPlanillaDeTaller: number;
// Resuelto: string;
// Observacion2: string;
// ObservacionJefe: string;