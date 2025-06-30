import { Component, Output, EventEmitter, ViewChild } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ResultsComponent } from './results/results.component';

@Component({
  selector: 'app-search',
  imports: [FormsModule, ResultsComponent],
  templateUrl: './search.component.html',
  // styleUrl: './search.component.scss',
})
export class SearchComponent {
  query = '';
  highlightedIndex = 0;
  selectionMade = false; // Track if Enter has been pressed

  @Output() requestNavigation = new EventEmitter<{
    outlet: string;
    path: any;
  }>();

  @ViewChild(ResultsComponent) resultsComponent?: ResultsComponent;

  onInputChange(newValue: string) {
    this.query = newValue;
    this.selectionMade = false; // Reset when user types
  }

  onSelectObject(name: string) {
    this.query = name;
  }

  // Forward navigation requests from <app-results>
  onRequestNavigation(event: { outlet: string; path: any }) {
    this.requestNavigation.emit(event);
  }

  onInputKeydown(event: KeyboardEvent) {
    if (this.selectionMade) {
      // Prevent further navigation after Enter
      event.preventDefault();
      return;
    }
    const resultsLength = this.resultsComponent?.results.length ?? 0;
    if (event.key === 'ArrowDown') {
      this.highlightedIndex = Math.min(
        this.highlightedIndex + 1,
        resultsLength - 1
      );
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      this.highlightedIndex = Math.max(this.highlightedIndex - 1, 0);
      event.preventDefault();
    } else if (event.key === 'Enter') {
      this.selectHighlightedResult();
      this.selectionMade = true;
      event.preventDefault();
    }
  }

  selectHighlightedResult() {
    if (this.resultsComponent) {
      this.resultsComponent.selectByIndex(this.highlightedIndex);
    }
  }
}
