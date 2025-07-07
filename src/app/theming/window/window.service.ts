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
    // clear all windows
    this.windowsSubject.next([]);

    // open search window
    await this.initializeDefaultWindow();
  }

  get windows(): AppWindow[] {
    return this.windowsSubject.value;
  }

  setWindows(windows: AppWindow[]) {
    this.windowsSubject.next(windows);
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
      componentData: { materialId, materialName, articleType, product, method },
    });
  }

  private updateOrAddWindow(id: string, window: AppWindow) {
    const existingWindow = this.windows.find((w) => w.id === id);
    if (existingWindow) {
      this.updateWindow(window);
    } else {
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
