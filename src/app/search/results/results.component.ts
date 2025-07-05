import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Material } from '../../object/object';
import { MaterialService } from '../../object/object.service';
import { WindowService } from '../../theming/window/window.service';

@Component({
  selector: 'app-results',
  imports: [CommonModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent {
  results: Material[] = [];
  everything: Material[] = [];
  showResults = true;
  loading = false;

  @Output() selectObject = new EventEmitter<string>();
  @Input() highlightedIndex = 0;

  constructor(
    public objectService: MaterialService,
    private windowService: WindowService
  ) {
    this.objectService.getObjects().subscribe((objects: any[]) => {
      this.everything = objects;
    });
  }

  @Input()
  set query(value: string) {
    this.loading = false;
    this.showResults = true;
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
    await this.windowService.openDetailsWindow(object.id, object.meta.name);

    this.showResults = false;
    this.loading = false;
  }

  selectByIndex(index: number) {
    if (this.results[index]) {
      this.onResultClick(this.results[index]);
    }
  }
}
