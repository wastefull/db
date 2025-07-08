import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MaterialService } from '../../object/object.service';
import {
  defaultButtons,
  noCloseButtons,
} from './status-bar/window-buttons/button';
import { AppWindow } from './window';

@Injectable({
  providedIn: 'root',
})
export class WindowService {
  private windowsSubject = new BehaviorSubject<AppWindow[]>([]);
  windows$ = this.windowsSubject.asObservable();

  constructor(private ms: MaterialService) {
    this.initializeDefaultWindow();
  }

  public async initializeDefaultWindow() {
    // important: dynamically import SearchComponent to avoid circular dependency
    const { SearchComponent } = await import('../../search/search.component');

    const searchWindow: AppWindow = {
      id: 'search',
      title: 'Search',
      icon: 'fa-search',
      isActive: true,
      isMinimized: false,
      isMaximized: false,
      buttons: noCloseButtons,
      component: SearchComponent,
    };

    this.windowsSubject.next([searchWindow]);
  }

  async resetToDefault() {
    this.windowsSubject.next([]);
    await this.initializeDefaultWindow();
  }

  get windows(): AppWindow[] {
    return this.windowsSubject.value;
  }

  setWindows(windows: AppWindow[]) {
    this.windowsSubject.next(windows);
  }

  // Set a window as active and deactivate others
  setActiveWindow(id: string) {
    const updatedWindows = this.windows.map((window) => ({
      ...window,
      isActive: window.id === id,
    }));
    this.windowsSubject.next(updatedWindows);
  }

  addWindow(window: AppWindow) {
    // console.log('Adding window:', window.id, 'with data:', window.componentData);

    // Deactivate all existing windows and make the new one active
    const updatedExistingWindows = this.windows.map((w) => ({
      ...w,
      isActive: false,
    }));

    const newWindow = { ...window, isActive: true };
    this.windowsSubject.next([...updatedExistingWindows, newWindow]);
  }

  removeWindow(id: string) {
    this.windowsSubject.next(this.windows.filter((w) => w.id !== id));
  }

  updateWindow(updated: AppWindow) {
    // console.log('Updating window:', updated.id, 'with data:', updated.componentData);

    // When updating a window, make it active and deactivate others
    const updatedWindows = this.windows.map((w) => {
      if (w.id === updated.id) {
        return { ...updated, isActive: true };
      } else {
        return { ...w, isActive: false };
      }
    });

    this.windowsSubject.next(updatedWindows);
  }

  async openDetailsWindow(materialId: string, materialName: string) {
    const { DetailsComponent } = await import(
      '../../object/details/details/details.component'
    );

    const existingDetails = this.windows.find((w) => w.id === 'details');
    if (existingDetails) {
      this.updateWindow({
        ...existingDetails,
        title: materialName,
        componentData: { materialId, materialName },
      });
    } else {
      this.addWindow({
        id: 'details',
        title: materialName,
        icon: 'fa-info',
        isActive: true,
        isMinimized: false,
        isMaximized: false,
        buttons: defaultButtons,
        component: DetailsComponent,
        componentData: { materialId, materialName },
      });
    }
  }

  async openProductPicker(
    materialId: string,
    materialName: string,
    articleType: string
  ) {
    const { ProductPickerComponent } = await import(
      '../../object/details/picker/product-picker/product-picker.component'
    );

    this.updateOrAddWindow('picker', {
      id: 'picker',
      title: 'Pick a Product',
      icon: 'fa-list',
      isActive: true,
      isMinimized: false,
      isMaximized: false,
      buttons: defaultButtons,
      component: ProductPickerComponent,
      componentData: { materialId, materialName, articleType },
    });
  }

  async openMethodPicker(
    materialId: string,
    materialName: string,
    articleType: string,
    product: string
  ) {
    const { MethodPickerComponent } = await import(
      '../../object/details/picker/method-picker/method-picker.component'
    );

    this.updateOrAddWindow('picker', {
      id: 'picker',
      title: 'Pick a Method',
      icon: 'fa-cogs',
      isActive: true,
      isMinimized: false,
      isMaximized: false,
      buttons: defaultButtons,
      component: MethodPickerComponent,
      componentData: { materialId, materialName, articleType, product },
    });
  }

  async openArticle(
    materialId: string,
    materialName: string,
    articleType: string,
    product: string,
    method: string
  ) {
    const { ArticleComponent } = await import(
      '../../object/details/article/article.component'
    );

    this.updateOrAddWindow('picker', {
      id: 'picker',
      title: this.getArticleTitle(articleType, materialName),
      icon: 'fa-file-text',
      isActive: true,
      isMinimized: false,
      isMaximized: false,
      buttons: defaultButtons,
      component: ArticleComponent,
      componentData: {
        materialId,
        materialName,
        articleType,
        product: product || 'all',
        method: method || 'all',
      },
    });
  }

  private updateOrAddWindow(id: string, window: AppWindow) {
    const existingWindow = this.windows.find((w) => w.id === id);
    if (existingWindow) {
      // console.log('Updating existing window:', id);
      this.updateWindow(window);
    } else {
      // console.log('Adding new window:', id);
      this.addWindow(window);
    }
  }

  private getArticleTitle(articleType: string, materialName: string): string {
    switch (articleType) {
      case 'compost':
        return `How to Compost ${materialName}`;
      case 'recycle':
        return `How to Recycle ${materialName}`;
      case 'upcycle':
        return `How to Upcycle ${materialName}`;
      default:
        return `Article - ${materialName}`;
    }
  }
}
