import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUsuario } from 'app/models/interface/iUsuario';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { IProfesor } from 'app/models/interface/iProfesor';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  
  protected url = environment.apiURI;
  constructor(private http: HttpClient) {}
  enviarLink(email: string): Observable<any> {
    const query = `usuarios/link/${email}`;
    const url = this.url + query;
    return this.http.get(url);
  }
  register(user: IUsuario) {
    const query = `usuarios/register`;
    const url = this.url + query;
    return this.http.post(url, user);
  }

  delete(id: number) {
    const query = `usuarios/${id}`;
    const url = this.url + query;
    return this.http.delete(url);
  }
  cambiarRol(_id: string, rol: string): Observable<IUsuario> {
    const query = `usuarios/change-role/${_id}`;
    const url = this.url + query;
    return this.http.post<any>(url, { rol });
  }
  obtenerUsuarioConRoles(): Observable<IUsuario[]> {
    const query = `usuarios`;
    const url = this.url + query;
    return this.http.get<any>(url);
  }
  asignarProfesor(usuarioId:string, profesor: IProfesor):Observable<any> {
    const query = `usuarios/asignar-profesor/${usuarioId}`;
    const url = this.url + query;
    return this.http.post<any>(url, { profesor });
}
}
