import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppWindow, defaultWindow, sampleWindows } from './window'; // Import sampleWindows
import { defaultButtons } from './status-bar/window-buttons/button';
import { MaterialService } from '../../object/object.service';
@Injectable({
  providedIn: 'root',
})
export class WindowService {
  updateWindowTitle(resultWindowId: string, name: string) {
    const updatedWindows = this.windows.map((w) =>
      w.id === resultWindowId ? { ...w, title: name } : w
    );
    this.setWindows(updatedWindows);
  }
  private windowsSubject = new BehaviorSubject<AppWindow[]>([]);
  windows$ = this.windowsSubject.asObservable();
  constructor(private ms: MaterialService) {
    this.setDefaultWindows();
  }
  get windows(): AppWindow[] {
    return this.windowsSubject.value;
  }

  setWindows(windows: AppWindow[]) {
    this.windowsSubject.next(windows);
  }

  setDefaultWindows() {
    this.windowsSubject.next([defaultWindow]);
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

  activateWindow(id: string) {
    const updatedWindows = this.windows.map((w) => ({
      ...w,
      isActive: w.id === id,
      isMinimized: false,
    }));
  }

  addDetailsWindow(
    objectId: string,
    afterAdd?: (outletName: string) => void
  ): void {
    const outletName = 'details';
    this.ms.getMaterialByName(objectId).subscribe((material) => {
      this.addWindow({
        id: 'details', // always the same id
        title: material?.meta?.name || 'Details',
        icon: 'fa-complete',
        isActive: true,
        isMinimized: false,
        isMaximized: false,
        buttons: defaultButtons,
        outlet: outletName,
      });
      if (afterAdd) afterAdd(outletName);
    });
  }

  createUniqueWindowIDByType(windowType: string): string {
    const existingTypeWindows = this.windows.filter((w) =>
      w.outlet.startsWith(windowType)
    );
    return `${windowType}${existingTypeWindows.length + 1}`;
  }
  hasWindow(id: string): boolean {
    return this.windows.some((w) => w.id === id);
  }
}
