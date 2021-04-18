import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICicloLectivo } from 'app/models/interface/iCicloLectivo';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CicloLectivoService {
  private cicloLectivoSubject = new BehaviorSubject<number>(null);
  public cicloLectivo$ = this.cicloLectivoSubject.asObservable().pipe(shareReplay(1));
 
  private ciclosLectivoSubject = new BehaviorSubject<ICicloLectivo[]>([]);
  public ciclosLectivo$ = this.ciclosLectivoSubject.asObservable().pipe(shareReplay(1));
 
  protected url = environment.apiURI;
  constructor(private http: HttpClient) {}

  setCicloLectivo(cicloLectivo: number) {
    this.cicloLectivoSubject.next(cicloLectivo);
  }
  setCiclosLectivos(): Observable<ICicloLectivo[]> {
    const query = `ciclolectivos`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  obtenerCiclosLectivos(): Observable<ICicloLectivo[]> {
    const query = `ciclolectivos`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
  obtenerCicloActual() {
    const query = `ciclolectivos/actual`;
    const url = this.url + query;

    return this.http.get<any>(url);
  }
}
