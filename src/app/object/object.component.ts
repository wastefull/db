import { Component, Input } from '@angular/core';
import { Object } from './object';

@Component({
  selector: 'app-object',
  imports: [],
  templateUrl: './object.component.html',
  styleUrl: './object.component.scss'
})
export class ObjectComponent {
public handleMissingImage($event: ErrorEvent) {
  console.debug($event);
  let target = $event.target as HTMLImageElement;
  target.src = '';
  let parent = target.parentElement;
  if (parent && parent.classList.contains('object')) {
    parent.hidden = true;
  }
}
  @Input() object!: Object;
}
