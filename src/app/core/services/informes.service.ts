import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InformesService {
  protected url = environment.apiURI;
  constructor(private http: HttpClient) {}
}
