import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IComision } from 'app/models/interface/iComision';
import { IQueryPag } from 'app/models/interface/iQueryPag';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ComisionService {
  protected url = environment.apiURI;
  constructor(private http: HttpClient) {}
  
  obtenerComisionPorId(comisionId: string): Observable<IComision> {
    const query = `comisiones/${comisionId}`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  obtenerComisiones(): Observable<IComision[]> {
    const query = `comisiones`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  obtenerComisionesHabilitadas(): Observable<IComision[]> {
    const query = `comisiones/habilitados`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  agregarComision(asignatura: IComision): Observable<IComision> {
    const query = `comisiones`;
    const url = this.url + query;

    return this.http.put<any>(url, asignatura);
  }

  actualizarComision(asignaturaId: string, asignatura: IComision): Observable<any> {
    const query = `comisiones/${asignaturaId}`;
    const url = this.url + query;

    return this.http.patch<any>(url, asignatura);
  }
  eliminarComision(asignaturaId: string): Observable<any> {
    const query = `comisiones/${asignaturaId}`;
    const url = this.url + query;

    return this.http.delete<any>(url);
  }
  deshabilitarComision(asignaturaId: string, activo: boolean): Observable<any> {
    const query = `comisiones/deshabilitar/${asignaturaId}`;
    const url = this.url + query;

    return this.http.put<any>(url, { activo });
  }
  habilitarComision(asignaturaId: string, activo: boolean): Observable<any> {
    const query = `comisiones/habilitar/${asignaturaId}`;
    const url = this.url + query;

    return this.http.put<any>(url, { activo });
  }
}
