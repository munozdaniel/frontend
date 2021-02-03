import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ISeguimientoAlumno } from 'app/models/interface/iSeguimientoAlumno';
import { IQueryPag } from 'app/models/interface/iQueryPag';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SeguimientoAlumnoService {
  protected url = environment.apiURI;
  constructor(private http: HttpClient) {}

  obtenerSeguimientoAlumnoPorId(seguimientoAlumnoId: string): Observable<ISeguimientoAlumno> {
    const query = `seguimiento-alumnos/${seguimientoAlumnoId}`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  obtenerSeguimientoAlumnoes(): Observable<ISeguimientoAlumno[]> {
    const query = `seguimiento-alumnos`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  obtenerSeguimientoAlumnoesHabilitadas(): Observable<ISeguimientoAlumno[]> {
    const query = `seguimiento-alumnos/habilitados`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  agregarSeguimientoAlumno(asignatura: ISeguimientoAlumno): Observable<ISeguimientoAlumno> {
    const query = `seguimiento-alumnos`;
    const url = this.url + query;

    return this.http.put<any>(url, asignatura);
  }

  actualizarSeguimientoAlumno(asignaturaId: string, asignatura: ISeguimientoAlumno): Observable<any> {
    const query = `seguimiento-alumnos/${asignaturaId}`;
    const url = this.url + query;

    return this.http.patch<any>(url, asignatura);
  }
  eliminarSeguimientoAlumno(asignaturaId: string): Observable<any> {
    const query = `seguimiento-alumnos/${asignaturaId}`;
    const url = this.url + query;

    return this.http.delete<any>(url);
  }
  deshabilitarSeguimientoAlumno(asignaturaId: string, activo: boolean): Observable<any> {
    const query = `seguimiento-alumnos/deshabilitar/${asignaturaId}`;
    const url = this.url + query;

    return this.http.put<any>(url, { activo });
  }
  habilitarSeguimientoAlumno(asignaturaId: string, activo: boolean): Observable<any> {
    const query = `seguimiento-alumnos/habilitar/${asignaturaId}`;
    const url = this.url + query;

    return this.http.put<any>(url, { activo });
  }
  //
  buscarAlumnosPorSeguimiento(resuelto?: boolean): Observable<ISeguimientoAlumno[]> {
    const query = `seguimiento-alumnos/resueltos`;
    const url = this.url + query;

    return this.http.post<any>(url, { resuelto });
  }
}
