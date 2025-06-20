import { Component, inject, Inject, Input } from '@angular/core';
import { ObjectComponent } from '../../object/object.component';
import { CommonModule } from '@angular/common';
import { MaterialService } from '../../object/object.service';
import { Material } from '../../object/object';
@Component({
  selector: 'app-results',
  imports: [ObjectComponent, CommonModule],
  templateUrl: './results.component.html',
  // styleUrl: './results.component.scss',
})
export class ResultsComponent {
  results: Material[] = [];
  everything: Material[] = [];

  constructor(public objectService: MaterialService) {
    this.objectService.getObjects().subscribe((objects: any[]) => {
      this.everything = objects;
    });
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
    this.results = this.everything;
  }
  // require input
  @Input()
  set query(value: string) {
    this.search(value);
  }
}
