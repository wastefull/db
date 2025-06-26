import { Component, Output, EventEmitter } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ResultsComponent } from './results/results.component';

@Component({
  selector: 'app-search',
  imports: [FormsModule, ResultsComponent],
  templateUrl: './search.component.html',
  // styleUrl: './search.component.scss',
})
export class SearchComponent {
  query: string = '';

  @Output() requestNavigation = new EventEmitter<{
    outlet: string;
    path: any;
  }>();

  onInputChange(newValue: string) {
    this.query = newValue;
  }

  onSelectObject(name: string) {
    this.query = name;
  }

  // Forward navigation requests from <app-results>
  onRequestNavigation(event: { outlet: string; path: any }) {
    this.requestNavigation.emit(event);
  }
}
