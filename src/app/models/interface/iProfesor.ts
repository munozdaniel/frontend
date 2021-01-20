export interface IProfesor {
  _id: string;
  profesorNro:string;
  nombreCompleto: string;
  telefono?: string;
  celular?: string;
  email: string;
  formacion: string;
  titulo: string;

  fechaCreacion: Date;
  fechaModificacion?: Date;
  activo: boolean;
}
