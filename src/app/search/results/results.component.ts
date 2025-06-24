import { Component, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { ObjectComponent } from '../../object/object.component';
import { CommonModule } from '@angular/common';
import { MaterialService } from '../../object/object.service';
import { Material } from '../../object/object';
import { Router } from '@angular/router';
import { WindowService } from '../../theming/window/window.service';
@Component({
  selector: 'app-results',
  imports: [ObjectComponent, CommonModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent {
  results: Material[] = [];
  everything: Material[] = [];
  showResults = true;
  loading = false;

  @Output() selectObject = new EventEmitter<string>();

  constructor(
    public objectService: MaterialService,
    private windowService: WindowService,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.objectService.getObjects().subscribe((objects: any[]) => {
      this.everything = objects;
    });
  }

  @Input()
  set query(value: string) {
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

  onResultClick(object: Material) {
    this.loading = true;
    this.selectObject.emit(object.meta.name);

    const resultWindowId = 'details';
    if (this.windowService.hasWindow(resultWindowId)) {
      this.windowService.activateWindow(resultWindowId);
      this.showResults = false;
      setTimeout(() => {
        this.ngZone.onStable.pipe().subscribe(() => {
          this.router.navigate([
            { outlets: { details: ['object', object.id] } },
          ]);
          this.loading = false;
        });
      });
      return;
    }

    this.windowService.addDetailsWindow(object.id, (outletName) => {
      setTimeout(() => {
        this.ngZone.onStable.pipe().subscribe(() => {
          this.showResults = false;
          this.router.navigate([
            { outlets: { [outletName]: ['object', object.id] } },
          ]);
          this.loading = false;
        });
      });
    });
  }
}
