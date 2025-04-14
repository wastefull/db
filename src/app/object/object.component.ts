import { Component, Input } from '@angular/core';
import { Object } from './object';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-object',
  imports: [],
  templateUrl: './object.component.html',
  styleUrl: './object.component.scss'
})
export class ObjectComponent {
public handleMissingImage($event: ErrorEvent) {
  let target = $event.target as HTMLImageElement;
  target.src = this.badImage();
  // let parent = target.parentElement;
  // if (parent) {
  //   parent.hidden = true;
  // }
}

public badImage(): string {
  return environment.thumbs_api + 'sample.png';
}
  @Input() object!: Object;
}
