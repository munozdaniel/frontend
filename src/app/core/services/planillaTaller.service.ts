import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import { IQueryPag } from 'app/models/interface/iQueryPag';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PlanillaTallerService {
  protected url = environment.apiURI;
  constructor(private http: HttpClient) {}
  obtenerPlanillaTalleresPaginado(filter = '', sortField = '', sortOrder = 'asc', pageNumber = 0, pageSize = 3): Observable<any> {
    const query = `planilla-taller/paginar`;
    const url = this.url + query;
    console.log('>>>', filter, sortField, sortOrder, pageNumber, pageSize);
    return this.http.get(url, {
      params: new HttpParams()
        //   .set('courseId', courseId.toString())
        .set('filter', filter)
        .set('sortField', sortField)
        .set('sortOrder', sortOrder)
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString()),
    });
  }
  obtenerPlanillaTallerPorId(PlanillaTallerId: string): Observable<IPlanillaTaller> {
    const query = `planilla-taller/${PlanillaTallerId}`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  obtenerPlanillaTalleres(): Observable<IPlanillaTaller[]> {
    const query = `planilla-taller`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  obtenerPlanillaTalleresHabilitadas(): Observable<IPlanillaTaller[]> {
    const query = `planilla-taller/habilitados`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  agregarPlanillaTaller(planillaTaller: IPlanillaTaller): Observable<IPlanillaTaller> {
    const query = `planilla-taller`;
    const url = this.url + query;

    return this.http.put<any>(url, planillaTaller);
  }

  actualizarPlanillaTaller(planillaTallerId: string, planillaTaller: IPlanillaTaller): Observable<any> {
    const query = `planilla-taller/${planillaTallerId}`;
    const url = this.url + query;

    return this.http.patch<any>(url, planillaTaller);
  }
  eliminarPlanillaTaller(planillaTallerId: string): Observable<any> {
    const query = `planilla-taller/${planillaTallerId}`;
    const url = this.url + query;

    return this.http.delete<any>(url);
  }
  deshabilitarPlanillaTaller(planillaTallerId: string, activo: boolean): Observable<any> {
    const query = `planilla-taller/deshabilitar/${planillaTallerId}`;
    const url = this.url + query;

    return this.http.put<any>(url, { activo });
  }
  habilitarPlanillaTaller(planillaTallerId: string, activo: boolean): Observable<any> {
    const query = `planilla-taller/habilitar/${planillaTallerId}`;
    const url = this.url + query;

    return this.http.put<any>(url, { activo });
  }
  //
  buscarAlumnosPorSeguimiento(resuelto?: boolean): Observable<IPlanillaTaller> {
    const query = `planilla-taller/resueltos`;
    const url = this.url + query;

    return this.http.post<any>(url, { resuelto });
  }
  //
  obtenerPlanillaTalleresPorCiclo(cicloLectivo: number): Observable<IPlanillaTaller[]> {
    const query = `planilla-taller/ciclo/${cicloLectivo}`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
}
