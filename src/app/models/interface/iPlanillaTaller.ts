export interface IPlanillaTaller {
  _id: string;
  // planillaTallerId: string;
  asignaturaId: string;
  profesorId: number;
  curso: number;
  division: number;
  comision: string;
  cicloLectivo: number;
  fechaInicio: string;
  observacion: string;
  fechaFinalizacion: string;
  bimestre: string;
}
