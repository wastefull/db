import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppWindow, sampleWindows } from './window'; // Import sampleWindows

@Injectable({
  providedIn: 'root',
})
export class WindowService {
  private windowsSubject = new BehaviorSubject<AppWindow[]>([]);
  windows$ = this.windowsSubject.asObservable();

  get windows(): AppWindow[] {
    return this.windowsSubject.value;
  }

  setWindows(windows: AppWindow[]) {
    this.windowsSubject.next(windows);
  }

  setDefaultWindows() {
    this.windowsSubject.next(sampleWindows());
  }

  addWindow(window: AppWindow) {
    this.windowsSubject.next([...this.windows, window]);
  }

  removeWindow(id: string) {
    this.windowsSubject.next(this.windows.filter((w) => w.id !== id));
  }

  updateWindow(updated: AppWindow) {
    this.windowsSubject.next(
      this.windows.map((w) => (w.id === updated.id ? updated : w))
    );
  }
}
