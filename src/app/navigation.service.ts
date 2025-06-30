import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private navigationSubject = new Subject<{ outlet: string; path: any }>();
  navigation$ = this.navigationSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  requestNavigation(outlet: string, path: any) {
    this.setLoading(true);
    this.navigationSubject.next({ outlet, path });
  }

  setLoading(isLoading: boolean) {
    this.loadingSubject.next(isLoading);
  }
}
