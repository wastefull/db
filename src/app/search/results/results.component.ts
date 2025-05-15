import { Component, inject, Inject, Input } from '@angular/core';
import { ObjectComponent } from '../../object/object.component';
import { CommonModule } from '@angular/common';
import { ObjectService } from '../../object/object.service';
import { Object } from '../../object/object';
@Component({
  selector: 'app-results',
  imports: [ObjectComponent, CommonModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
})
export class ResultsComponent {
  results: Object[] = [];
  everything: Object[] = [];

  constructor(public objectService: ObjectService) {
    this.everything = this.objectService.getObjects();
  }

  search(query: string): void {
    if (query) {
      this.results = this.everything.filter((object) =>
        object.meta.name.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      this.results = this.everything;
    }
  }
  // require input
  @Input()
  set query(value: string) {
    this.search(value);
  }
}
