import { Injectable } from '@angular/core';
import { defaultObject, Object } from './object';
import { dummy_data } from './dummy/dummy_json';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class ObjectService {
  protected results: Object[] = [];

  constructor(private http: HttpClient) {}
  getObjects() {
    return this.http.get(`${environment.apiBaseUrl}/api/airtable`);
  }
}
