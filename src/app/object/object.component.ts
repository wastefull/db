import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Material } from './object';

@Component({
  selector: 'app-object',
  templateUrl: './object.component.html',
  imports: [],
})
export class ObjectComponent {
  @Input() object!: Material;
  @Output() select = new EventEmitter<Material>();

  onClick() {
    this.select.emit(this.object);
  }
}
