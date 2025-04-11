import { Component } from '@angular/core';
import { Object } from '../object/object';
import { CommonModule } from '@angular/common';
import { ResultsComponent } from './results/results.component';

@Component({
  selector: 'app-search',
  imports: [CommonModule, ResultsComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {

}
