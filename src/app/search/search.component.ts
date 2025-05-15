import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResultsComponent } from './results/results.component';

@Component({
  selector: 'app-search',
  imports: [CommonModule, FormsModule, ResultsComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  query: string = '';

  onInputChange(newValue: string) {
    this.query = newValue;
  }
}
