import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAlumno } from 'app/models/interface/iAlumno';
import { IAlumnoPaginado } from 'app/models/interface/iAlumnoPaginado';
import { IAsignatura } from 'app/models/interface/iAsignatura';
import { IAsistencia } from 'app/models/interface/iAsistencia';
import { ICicloLectivo } from 'app/models/interface/iCicloLectivo';
import { IFichaAlumnoParam } from 'app/models/interface/iFichaAlumnoParam';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import { IQueryPag } from 'app/models/interface/iQueryPag';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AlumnoService {
  private fichaAlumnoSubject = new BehaviorSubject<IFichaAlumnoParam>(null);
  public fichaAlumno$ = this.fichaAlumnoSubject.asObservable().pipe(shareReplay(1));

  setFichaAlumnoConsulta({ cicloLectivo, curso, division }) {
    this.fichaAlumnoSubject.next({ cicloLectivo, curso, division });
  }

  protected url = environment.apiURI;
  constructor(private http: HttpClient) {}
  migrar() {
    const query = `alumnos/migrar`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  findAlumnos(filter = '', sortOrder = 'asc', pageNumber = 0, pageSize = 3): Observable<IAlumno[]> {
    return this.http.get<any>('alumnos/paginado2', {
      params: new HttpParams()
        .set('filter', filter)
        .set('sortOrder', sortOrder)
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString()),
    });
  }
  obtenerAlumnosPaginados(consulta?: IQueryPag): Observable<IAlumnoPaginado> {
    let query = `alumnos/paginado`;
    if (consulta) {
      // page: 1, limit: 1,
      console.log('consulta.page', consulta.page);

      if (consulta.page || consulta.page > 0) {
        console.log('OK');
        query += `?page=${consulta.page + 1}`; // +1 porque el mat-paginator anda raro
      } else {
        console.log('NOOOO');
        query += `?page=1`;
      }
      if (consulta.limit) {
        query += `&limit=${consulta.limit}`;
      }
      if (consulta.ordenBy) {
        query += `&sort=${JSON.stringify(consulta.ordenBy)}`;
      }
      // No se va a usar en este caso
      if (consulta.query) {
        query += `&query=${JSON.stringify(consulta.query)}`;
      }
    }
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  obtenerAlumnoPorId(alumnoId: string): Observable<IAlumno> {
    const query = `alumnos/${alumnoId}`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }

  agregarAlumno(alumno: IAlumno): Observable<IAlumno> {
    const query = `alumnos`;
    const url = this.url + query;

    return this.http.put<any>(url, alumno);
  }

  actualizarAlumno(alumnoId: string, alumno: IAlumno): Observable<any> {
    const query = `alumnos/${alumnoId}`;
    const url = this.url + query;

    return this.http.patch<any>(url, alumno);
  }
  eliminarAlumno(alumnoId: string): Observable<any> {
    const query = `alumnos/${alumnoId}`;
    const url = this.url + query;

    return this.http.delete<any>(url);
  }
  deshabilitarAlumno(alumnoId: string, activo: boolean): Observable<any> {
    const query = `alumnos/estado/${alumnoId}`;
    const url = this.url + query;

    return this.http.put<any>(url, { activo });
  }
  obtenerFichaAlumnos(cicloLectivo: ICicloLectivo, division: number, curso: number): Observable<IAlumno[]> {
    const query = `alumnos/ficha`;
    const url = this.url + query;

    return this.http.post<any>(url, { cicloLectivo, curso, division });
    //   .pipe(tap((datos) => this.setFichaAlumnoConsulta({ cicloLectivo, curso, division })));
  }
  eliminarColeccion(): Observable<any> {
    const query = `alumnos/eliminar-coleccion`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  obtenerAlumnos(): Observable<IAlumno[]> {
    const query = `alumnos/todos`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  obtenerAlumnosPorCurso(curso: number, division: number, comision: string): Observable<IAlumno[]> {
    const query = `alumnos/por-curso`;
    const url = this.url + query;

    return this.http.post<any>(url, { curso, division, comision });
  }
  obtenerAlumnosPorCursoCiclo(curso: number, division: number, comision: string, ciclo: number): Observable<IAlumno[]> {
    const query = `alumnos/por-curso-ciclo`;
    const url = this.url + query;

    return this.http.post<any>(url, { curso, division, comision, ciclo });
  }
  obtenerAlumnosPorCursoDivisionCiclo(curso: number, division: number, ciclo: number): Observable<IAlumno[]> {
    const query = `alumnos/por-curso-division-ciclo`;
    const url = this.url + query;

    return this.http.post<any>(url, { curso, division, ciclo });
  }

  obtenerAlumnosPorCursoEspecifico(curso: number, comision: string, division: number, cicloLectivo: ICicloLectivo): Observable<IAlumno[]> {
    const query = `alumnos/por-curso-especifico`;
    const url = this.url + query;

    return this.http.post<any>(url, { curso, comision, division, cicloLectivo });
  }
  obtenerAlumnosPorCursoDivisionesCiclo(curso: number, divisiones: number[], cicloLectivo: ICicloLectivo): Observable<IAlumno[]> {
    const query = `alumnos/por-curso-divisiones-ciclo`;
    const url = this.url + query;

    return this.http.post<any>(url, { curso, divisiones, cicloLectivo });
  }
  actualizarAlNuevoCiclo(curso: number, divisiones: number[], cicloAnterior: ICicloLectivo, ciclo: ICicloLectivo): Observable<any> {
    const query = `alumnos/`;
    const url = this.url + query;

    return this.http.post<any>(url, { curso, divisiones, cicloAnterior, ciclo });
  }
  disponibleLegajo(legajo: any): Observable<boolean> {
    const query = `alumnos/disponible-legajo/${legajo}`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  guardarMasivo(alumnosCheck: IAlumno[]): Observable<any> {
    const query = `alumnos/guardar-masivo`;
    const url = this.url + query;

    return this.http.put<any>(url, alumnosCheck);
  }

  informarAusencia(
    nombreAdulto: string,
    fechaInasitencia: string,
    faltas: number,
    nombreAlumno: string,
    emailAdulto: string,
    observacion: string
  ): Observable<any> {
    const query = `alumnos/informar-ausencia`;
    const url = this.url + query;

    return this.http.post<any>(url, {
      nombreAdulto,
      fechaInasitencia,
      faltas,
      nombreAlumno,
      emailAdulto,
      observacion,
    });
  }
  //   Informes
  obtenerAlumnosAsignatura(asignatura: IAsignatura): Observable<IAlumno[]> {
    const query = `alumnos/por-asignatura`;
    const url = this.url + query;

    return this.http.post<any>(url, asignatura);
  }
  informeAlumnosPorPlanilla(planillaTaller: IPlanillaTaller): Observable<any> {
    const query = `alumnos/informe-por-planilla/${planillaTaller._id}`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
}
