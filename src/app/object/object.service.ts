import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ObjectService {
  private apiBase = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getObjects(): Observable<any> {
    return this.http.get(`${this.apiBase}/materials`);
  }
  getMaterialByName(name: string) {
    return this.http.get(
      `${this.apiBase}/material/${encodeURIComponent(name)}`
    );
  }

  getArticlesForMaterial(name: string): Observable<any> {
    return this.http.get(
      `${this.apiBase}/material/${encodeURIComponent(name)}/articles`
    );
  }
}
