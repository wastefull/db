import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MaterialService } from '../object/object.service';
import { SearchService } from '../search.service';
import { WindowService } from '../theming/window/window.service';
import { ResultsComponent } from './results/results.component';

@Component({
  selector: 'app-search',
  imports: [CommonModule, FormsModule, ResultsComponent],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
})
export class SearchComponent implements OnInit, OnDestroy {
  query = '';
  highlightedIndex = 0;
  selectionMade = false;
  isLoading = false;

  private sub?: Subscription;

  @ViewChild(ResultsComponent) resultsComponent?: ResultsComponent;

  constructor(
    private searchService: SearchService,
    private windowService: WindowService,
    private materialService: MaterialService
  ) {
    console.log('SearchComponent constructor called');
  }

  ngOnInit() {
    console.log('SearchComponent ngOnInit called');
    this.sub = this.searchService.query$.subscribe((q) => {
      console.log('Query changed to:', q);
      this.query = q;
      this.highlightedIndex = 0;
      this.selectionMade = false;
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  onSearchBarClick() {
    console.log('Search bar clicked!');
  }

  onInputChange(newValue: string | null) {
    console.log('Input changed:', newValue);
    if (newValue !== null && newValue !== undefined) {
      this.query = newValue;
      this.searchService.setQuery(newValue);
      this.selectionMade = false;
    }
  }

  onSelectObject(materialName: string) {
    console.log('Object selected:', materialName);
    this.materialService
      .getMaterialByName(materialName)
      .subscribe((material) => {
        this.windowService.openDetailsWindow(material.id, material.meta.name);
      });
    this.searchService.setQuery(materialName);
    this.query = '';
  }

  onInputKeydown(event: KeyboardEvent) {
    console.log('Key pressed:', event.key);

    const target = event.target as HTMLInputElement;
    if (target && target.value !== this.query) {
      console.log('Updating query from keydown:', target.value);
      this.onInputChange(target.value);
    }

    if (this.selectionMade) {
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
