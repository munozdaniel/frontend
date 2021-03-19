import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUsuario } from 'app/models/interface/iUsuario';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<IUsuario[]>(`${environment.apiURI}/usuario`);
  }

  register(user: IUsuario) {
    return this.http.post(`${environment.apiURI}/usuario/register`, user);
  }

  delete(id: number) {
    return this.http.delete(`${environment.apiURI}/usuario/${id}`);
  }
}
