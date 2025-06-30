import {
  Component,
  Input,
  Output,
  EventEmitter,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { ObjectComponent } from '../../object/object.component';
import { MaterialService } from '../../object/object.service';
import { Material } from '../../object/object';
import { Router, RouterModule } from '@angular/router';
import { WindowService } from '../../theming/window/window.service';
import { NavigationService } from '../../navigation.service';

@Component({
  selector: 'app-results',
  imports: [ObjectComponent, RouterModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent {
  results: Material[] = [];
  everything: Material[] = [];
  showResults = true;
  loading = false;

  @Output() selectObject = new EventEmitter<string>();
  // Bubble up the (requestNavigation) event from ResultsComponent → SearchComponent → WindowComponent → AppComponent
  @Output() requestNavigation = new EventEmitter<{
    outlet: string;
    path: any;
  }>();

  constructor(
    public objectService: MaterialService,
    private windowService: WindowService,
    private router: Router,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private navigationService: NavigationService // Add this
  ) {
    this.objectService.getObjects().subscribe((objects: any[]) => {
      this.everything = objects;
    });
  }

  @Input()
  set query(value: string) {
    this.loading = false;
    this.showResults = true; // Show results whenever query changes
    this.search(value);
  }

  search(query: string): void {
    if (query) {
      this.results = this.everything.filter((object) =>
        object.meta.name.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      this.results = [];
    }
  }

  all(): void {
    this.showResults = true;
    this.results = this.everything;
  }

  async onResultClick(object: Material) {
    if (this.loading) return;
    this.loading = true;
    this.selectObject.emit(object.meta.name);

    const resultWindowId = 'details';
    if (!this.windowService.hasWindow(resultWindowId)) {
      this.windowService.addDetailsWindow(object.id, (outletName) => {
        this.navigationService.requestNavigation(outletName, [
          'object',
          object.id,
        ]);
        this.showResults = false;
        this.loading = false;
      });
    } else {
      this.windowService.activateWindow(resultWindowId);
      this.windowService.updateWindowTitle(resultWindowId, object.meta.name);
      this.navigationService.requestNavigation('details', [
        'object',
        object.id,
      ]);
      this.showResults = false;
      this.loading = false;
    }
  }

  private waitForOutlet(name: string, timeout = 1000): Promise<void> {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const check = () => {
        const outlet = document.querySelector(`router-outlet[name="${name}"]`);
        if (outlet) {
          resolve();
        } else if (Date.now() - start > timeout) {
          reject('Outlet not found in time');
        } else {
          setTimeout(check, 10);
        }
      };
      check();
    });
  }
}
