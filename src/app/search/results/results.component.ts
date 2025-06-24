import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ObjectComponent } from '../../object/object.component';
import { CommonModule } from '@angular/common';
import { MaterialService } from '../../object/object.service';
import { Material } from '../../object/object';
import { Router } from '@angular/router';

@Component({
  selector: 'app-results',
  imports: [ObjectComponent, CommonModule],
  templateUrl: './results.component.html',
})
export class ResultsComponent {
  results: Material[] = [];
  everything: Material[] = [];
  showResults = true;

  @Output() selectObject = new EventEmitter<string>();

  constructor(public objectService: MaterialService, private router: Router) {
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
    this.showResults = false; // Hide results after selection
    this.selectObject.emit(object.meta.name);
    this.router.navigate([{ outlets: { window2: ['object', object.id] } }]);
  }
}
