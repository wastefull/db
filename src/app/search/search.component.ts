import { Component } from '@angular/core';
import { Object } from '../object/object';
import { CommonModule } from '@angular/common';
import { ResultsComponent } from './results/results.component';
import { ObjectService } from '../object/object.service';

@Component({
  selector: 'app-search',
  imports: [CommonModule, ResultsComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  query: string = '';
  os: ObjectService = new ObjectService;
  constructor() {
    this.searchResults(this.query);
  }
searchResults(query: string) {
  if (query) {
    this.query = query;
  } else {
    this.query = '';
  }
  // Call the search function in the ResultsComponent
  const resultsComponent = new ResultsComponent(this.os);
  resultsComponent.search(query);
}

// Detect input change
  onInputChange(newValue: string) {
    this.query = newValue;
    this.searchResults(this.query);
  }

}
