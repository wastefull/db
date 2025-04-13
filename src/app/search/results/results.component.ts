import { Component, inject, Inject } from '@angular/core';
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
  constructor() {
    this.results = this.objectService.getObjects();
  }
}
