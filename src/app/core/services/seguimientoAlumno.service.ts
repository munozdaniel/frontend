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

  actualizarSeguimientoAlumno(seguimientoId: string, asignatura: ISeguimientoAlumno): Observable<any> {
    const query = `seguimiento-alumnos/${seguimientoId}`;
    const url = this.url + query;

    return this.http.patch<any>(url, asignatura);
  }
  eliminarSeguimientoAlumno(seguimientoId: string): Observable<any> {
    const query = `seguimiento-alumnos/${seguimientoId}`;
    const url = this.url + query;

    return this.http.delete<any>(url);
  }
  deshabilitarSeguimientoAlumno(seguimientoId: string, activo: boolean): Observable<any> {
    const query = `seguimiento-alumnos/deshabilitar/${seguimientoId}`;
    const url = this.url + query;

    return this.http.put<any>(url, { activo });
  }
  habilitarSeguimientoAlumno(seguimientoId: string, activo: boolean): Observable<any> {
    const query = `seguimiento-alumnos/habilitar/${seguimientoId}`;
    const url = this.url + query;

    return this.http.put<any>(url, { activo });
  }
  //
  buscarAlumnosPorSeguimiento(resuelto?: boolean): Observable<ISeguimientoAlumno[]> {
    const query = `seguimiento-alumnos/resueltos`;
    const url = this.url + query;

    return this.http.post<any>(url, { resuelto });
  }
  obtenerSeguimientoAlumnoPorPlanillaCiclo(planillaId: string, alumnoId: string, ciclo: number) {
    console.log('buscar planillaId: string, alumnoId: string, ciclo', planillaId, alumnoId, ciclo);
    const query = `seguimiento-alumnos/por-planilla/${planillaId}`;
    const url = this.url + query;

    return this.http.post<any>(url, { alumnoId, ciclo });
  }
  obtenerPorPlanillaYAlumno(planillaId: string, alumno_id: string) {
    const query = `seguimiento-alumnos/por-planilla-alumno/${planillaId}/${alumno_id}`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
}
