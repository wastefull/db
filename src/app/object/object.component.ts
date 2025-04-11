import { Component, Input } from '@angular/core';
import { Object } from './object';

@Component({
  selector: 'app-object',
  imports: [],
  templateUrl: './object.component.html',
  styleUrl: './object.component.scss'
})
export class ObjectComponent {
  @Input() object!: Object;
}
