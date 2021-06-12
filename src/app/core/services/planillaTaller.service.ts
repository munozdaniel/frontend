import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICicloLectivo } from 'app/models/interface/iCicloLectivo';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import { IPlanillaTallerParam } from 'app/models/interface/iPlanillaTallerParams';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PlanillaTallerService {
  private planillaParamsSubject = new BehaviorSubject<IPlanillaTallerParam>(null);
  public planillaParams$ = this.planillaParamsSubject.asObservable().pipe(shareReplay(1));

  protected url = environment.apiURI;
  constructor(private http: HttpClient) {}
  setPlanillaParams(params: IPlanillaTallerParam) {
    this.planillaParamsSubject.next(params);
  }

  obtenerPlanillaTalleresPaginado(filter = '', sortField = '', sortOrder = 'asc', pageNumber = 0, pageSize = 3): Observable<any> {
    const query = `planilla-taller/paginar`;
    const url = this.url + query;
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
  obtenerPlanillaTallerPorIdCiclo(planillaTallerId: string, ciclo: number): Observable<IPlanillaTaller> {
    const query = `planilla-taller/filtro/${planillaTallerId}/${ciclo}`;
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

  actualizarPlanillaTaller(planillaTallerId: string, planillaTaller: any): Observable<any> {
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

  //   NO SE DEBERIA USAR MAS, COMPROBAR
  buscarTotalAsistenciaPorPlanilla(planillaId: string): Observable<any> {
    const query = `planilla-taller/${planillaId}/total-asistencias`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  obtenerPlanillasPorCursoCiclo(curso: number, comision: string, division: number, cicloLectivo: ICicloLectivo): Observable<any> {
    const query = `planilla-taller/por-curso-ciclo`;
    const url = this.url + query;

    return this.http.post<any>(url, { curso, comision, division, cicloLectivo });
  }
  //
  obtenerPlanillaTalleresPorCiclo(cicloLectivo: number): Observable<IPlanillaTaller[]> {
    const query = `planilla-taller/ciclo/${cicloLectivo}`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  obtenerPlanillaTalleresPorCicloPorProfesor(cicloLectivo: number, profesorId: string): Observable<IPlanillaTaller[]> {
    const query = `planilla-taller/ciclo-profesor/${cicloLectivo}`;
    const url = this.url + query;

    return this.http.post<any>(url, { profesorId });
  }
}
