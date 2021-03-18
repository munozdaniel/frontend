export interface IUsuario {
  _id?: string;
  token?: string;
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  rol?: 'PROFESOR' | 'ADMIN' | 'DIRECTOR' | 'JEFETALLER' | 'PRECEPTOR';

  observacion?: string; // Agregado por el dueño del comercio

  fechaCreacion: Date;
  usuarioCreacion?: string | null;
  activo: boolean;
  picture?: string; //
}
