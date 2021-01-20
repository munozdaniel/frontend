import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProfesor } from 'app/models/interface/iProfesor';
import { IQueryPag } from 'app/models/interface/iQueryPag';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfesorService {
  protected url = environment.apiURI;
  constructor(private http: HttpClient) {}
  
  obtenerProfesorPorId(productoId: string): Observable<IProfesor> {
    const query = `profesores/${productoId}`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  obtenerProfesores(): Observable<IProfesor[]> {
    const query = `profesores`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  obtenerProfesoresHabilitadas(): Observable<IProfesor[]> {
    const query = `profesores/habilitados`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  agregarProfesor(asignatura: IProfesor): Observable<IProfesor> {
    const query = `profesores`;
    const url = this.url + query;

    return this.http.put<any>(url, asignatura);
  }

  actualizarProfesor(asignaturaId: string, asignatura: IProfesor): Observable<any> {
    const query = `profesores/${asignaturaId}`;
    const url = this.url + query;

    return this.http.patch<any>(url, asignatura);
  }
  eliminarProfesor(asignaturaId: string): Observable<any> {
    const query = `profesores/${asignaturaId}`;
    const url = this.url + query;

    return this.http.delete<any>(url);
  }
  deshabilitarProfesor(asignaturaId: string, activo: boolean): Observable<any> {
    const query = `profesores/deshabilitar/${asignaturaId}`;
    const url = this.url + query;

    return this.http.put<any>(url, { activo });
  }
  habilitarProfesor(asignaturaId: string, activo: boolean): Observable<any> {
    const query = `profesores/habilitar/${asignaturaId}`;
    const url = this.url + query;

    return this.http.put<any>(url, { activo });
  }
}
