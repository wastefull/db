import {
  Component,
  Output,
  EventEmitter,
  ViewChild,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ResultsComponent } from './results/results.component';
import { SearchService } from '../search.service';
import { NavigationService } from '../navigation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search',
  imports: [FormsModule, ResultsComponent],
  templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit, OnDestroy {
  query = '';
  highlightedIndex = 0;
  selectionMade = false;
  isLoading = false;

  private sub?: Subscription;
  private loadingSub?: Subscription;

  @Output() requestNavigation = new EventEmitter<{
    outlet: string;
    path: any;
  }>();

  @ViewChild(ResultsComponent) resultsComponent?: ResultsComponent;

  constructor(
    private searchService: SearchService,
    private navigationService: NavigationService
  ) {}

  ngOnInit() {
    this.sub = this.searchService.query$.subscribe((q) => {
      this.query = q;
      this.highlightedIndex = 0;
      this.selectionMade = false;
    });

    this.loadingSub = this.navigationService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.loadingSub?.unsubscribe();
  }

  onInputChange(newValue: string) {
    this.searchService.setQuery(newValue);
    this.selectionMade = false;
  }

  onSelectObject(name: string) {
    this.searchService.setQuery(name);
    this.query = '';
  }

  onInputKeydown(event: KeyboardEvent) {
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
