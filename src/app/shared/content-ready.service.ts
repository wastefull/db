import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContentReadyService {
  private contentReadySubject = new Subject<string>();
  contentReady$ = this.contentReadySubject.asObservable();

  // Track loading state for each window
  private windowLoadingStates = new BehaviorSubject<{ [windowId: string]: boolean }>({});
  windowLoadingStates$ = this.windowLoadingStates.asObservable();

  notifyContentReady(windowId: string) {
    // console.log('Content ready for window:', windowId);

    // Update the loading state for this window
    const currentStates = this.windowLoadingStates.value;
    this.windowLoadingStates.next({
      ...currentStates,
      [windowId]: false, // false means not loading (content ready)
    });

    this.contentReadySubject.next(windowId);
  }

  setWindowLoading(windowId: string, isLoading: boolean) {
    const currentStates = this.windowLoadingStates.value;
    this.windowLoadingStates.next({
      ...currentStates,
      [windowId]: isLoading,
    });
  }

  isWindowLoading(windowId: string): boolean {
    return this.windowLoadingStates.value[windowId] || false;
  }
}
