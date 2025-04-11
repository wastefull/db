import { Component } from '@angular/core';
import { ObjectComponent } from '../../object/object.component';
import { CommonModule } from '@angular/common';
import { Object } from '../../object/object';
@Component({
  selector: 'app-results',
  imports: [ObjectComponent, CommonModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent {
  object: Object = {
    id: '0',
    name: 'test',
    altNames: ['test'],
    thumbnail: '../assets/sample.png',
    tags: ['test'],
  }

  results: Object[] = [
    this.object,
  ]

}
