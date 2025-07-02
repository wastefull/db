import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MaterialService } from '../../object/object.service';
import { Material } from '../../object/object';
import { RouterModule } from '@angular/router';
import { WindowService } from '../../theming/window/window.service';
import { NavigationService } from '../../navigation.service';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-results',
  imports: [RouterModule, IonicModule],
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

  @Input() highlightedIndex = 0;

  constructor(
    public objectService: MaterialService,
    private windowService: WindowService,
    private navigationService: NavigationService
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
    this.navigationService.setLoading(true);

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
        this.navigationService.setLoading(false);
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
      this.navigationService.setLoading(false);
    }
  }

  selectByIndex(index: number) {
    if (this.results[index]) {
      this.onResultClick(this.results[index]);
    }
  }
}
