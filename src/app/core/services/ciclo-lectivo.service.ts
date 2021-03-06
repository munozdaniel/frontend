import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CicloLectivoService {
  private cicloLectivoSubject = new BehaviorSubject<number>(null);
  public cicloLectivo$ = this.cicloLectivoSubject.asObservable();
  protected url = environment.apiURI;
  constructor(private http: HttpClient) {}

  setCicloLectivo(cicloLectivo: number) {
    this.cicloLectivoSubject.next(cicloLectivo);
  }
}
