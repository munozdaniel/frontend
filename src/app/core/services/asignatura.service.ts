import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAsignatura } from 'app/models/interface/iAsignatura';
import { IQueryPag } from 'app/models/interface/iQueryPag';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AsignaturaService {
  protected url = environment.apiURI;
  constructor(private http: HttpClient) {}
  findAsignaturas(filter = '', sortOrder = 'asc', pageNumber = 0, pageSize = 3): Observable<IAsignatura[]> {
    return this.http.get<any>('asignaturas/paginado2', {
      params: new HttpParams()
        .set('filter', filter)
        .set('sortOrder', sortOrder)
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString()),
    });
  }
  //   obtenerAsignaturasPaginados(consulta?: IQueryPag): Observable<IAsignaturaPaginado> {
  //     let query = `asignaturas/paginado`;
  //     if (consulta) {
  //       // page: 1, limit: 1,
  //       console.log('consulta.page', consulta.page);

  //       if (consulta.page || consulta.page > 0) {
  //         console.log('OK');
  //         query += `?page=${consulta.page + 1}`; // +1 porque el mat-paginator anda raro
  //       } else {
  //         console.log('NOOOO');
  //         query += `?page=1`;
  //       }
  //       if (consulta.limit) {
  //         query += `&limit=${consulta.limit}`;
  //       }
  //       if (consulta.ordenBy) {
  //         query += `&sort=${JSON.stringify(consulta.ordenBy)}`;
  //       }
  //       // No se va a usar en este caso
  //       if (consulta.query) {
  //         query += `&query=${JSON.stringify(consulta.query)}`;
  //       }
  //     }
  //     const url = this.url + query;

  //     return this.http.get<any>(url);
  //   }
  obtenerAsignaturaPorId(productoId: string): Observable<IAsignatura> {
    const query = `asignaturas/${productoId}`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  obtenerAsignaturas(): Observable<IAsignatura[]> {
    const query = `asignaturas`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  obtenerAsignaturasHabilitadas(): Observable<IAsignatura[]> {
    const query = `asignaturas/habilitados`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  agregarAsignatura(asignatura: IAsignatura): Observable<IAsignatura> {
    const query = `asignaturas`;
    const url = this.url + query;

    return this.http.put<any>(url, asignatura);
  }

  actualizarAsignatura(asignaturaId: string, asignatura: IAsignatura): Observable<any> {
    const query = `asignaturas/${asignaturaId}`;
    const url = this.url + query;

    return this.http.patch<any>(url, asignatura);
  }
  eliminarAsignatura(asignaturaId: string): Observable<any> {
    const query = `asignaturas/${asignaturaId}`;
    const url = this.url + query;

    return this.http.delete<any>(url);
  }
  deshabilitarAsignatura(asignaturaId: string, activo: boolean): Observable<any> {
    const query = `asignaturas/deshabilitar/${asignaturaId}`;
    const url = this.url + query;

    return this.http.put<any>(url, { activo });
  }
  habilitarAsignatura(asignaturaId: string, activo: boolean): Observable<any> {
    const query = `asignaturas/habilitar/${asignaturaId}`;
    const url = this.url + query;

    return this.http.put<any>(url, { activo });
  }
}
