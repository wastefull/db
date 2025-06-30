import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private querySubject = new BehaviorSubject<string>('');
  query$ = this.querySubject.asObservable();

  setQuery(query: string) {
    this.querySubject.next(query);
  }

  clearSearch() {
    this.querySubject.next('');
  }
}
