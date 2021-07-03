export interface IAdulto {
  nombreCompleto: string;
  telefono?: string;
  celular?: string;
  email: string;
  tipoAdulto: 'TUTOR' | 'PADRE' | 'MADRE';
  fechaCreacion: Date;
  fechaModificacion?: Date;
  preferencia?:boolean;
  activo: boolean;

  index?:number; // Para trabajarlo en la vista
}
