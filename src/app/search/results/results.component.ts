import { Component, inject, Inject, Input } from '@angular/core';
import { ObjectComponent } from '../../object/object.component';
import { CommonModule } from '@angular/common';
import { ObjectService } from  '../../object/object.service';
import { Object } from '../../object/object';
@Component({
  selector: 'app-results',
  imports: [ObjectComponent, CommonModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent {
 results: Object[] = [];
 objectService: ObjectService = inject(ObjectService);
 everything: Object[] = [];

 constructor(@Inject(ObjectService) objectService: ObjectService) {
    this.objectService = objectService;
    this.everything = this.objectService.getObjects();
    this.results = this.everything;
  }

  search(query: string): void {
    if (query) {
      this.results = this.everything.filter((object) =>
        object.name.toLowerCase().includes(query.toLowerCase()) ||
        object.altNames.some((altName) => altName.toLowerCase().includes(query.toLowerCase())) ||
        object.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
      );
    } else {
      this.results = [];
    }
  }
  // require input
  @Input()
  set query(value: string) {
    this.search(value);
  }
}
