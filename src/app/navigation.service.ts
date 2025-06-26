import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private navigationSubject = new Subject<{ outlet: string; path: any }>();
  navigation$ = this.navigationSubject.asObservable();

  requestNavigation(outlet: string, path: any) {
    this.navigationSubject.next({ outlet, path });
  }
}
