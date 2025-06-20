import { Component, Input } from '@angular/core';
import { Material } from './object';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ImageDisplayComponent } from '../image-display/image-display.component';

@Component({
  selector: 'app-object',
  imports: [RouterLink, CommonModule],
  templateUrl: './object.component.html',
  // styleUrl: './object.component.scss',
})
export class ObjectComponent {
  @Input() object!: Material;
}
