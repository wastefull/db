import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Material } from './object';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-object',
  templateUrl: './object.component.html',
  imports: [CommonModule],
  // styleUrls: ['./object.component.scss'],
})
export class ObjectComponent {
  @Input() object!: Material;
  @Output() select = new EventEmitter<Material>();

  onClick() {
    this.select.emit(this.object);
  }
}
