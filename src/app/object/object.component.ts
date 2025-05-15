import { Component, Input } from '@angular/core';
import { defaultObject, Object } from './object';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-object',
  imports: [RouterLink],
  templateUrl: './object.component.html',
  styleUrl: './object.component.scss',
})
export class ObjectComponent {
  public handleMissingImage($event: ErrorEvent) {
    let target = $event.target as HTMLImageElement;
    target.src = defaultObject.image.url;
  }
  @Input() object!: Object;
}
