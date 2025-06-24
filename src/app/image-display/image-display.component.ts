import { Component, Input } from '@angular/core';
import { defaultMaterial, Material } from '../object/object'; // Adjust the path as necessary
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-display',
  imports: [CommonModule],
  templateUrl: './image-display.component.html',
})
export class ImageDisplayComponent {
  photographer: { username: string; profile_url: string } | null = null;
  src = '';
  alt = '';
  @Input() object!: Material;

  handleMissingImage: ($event: ErrorEvent) => void = ($event: ErrorEvent) => {
    // console.error('Image load error:', $event);
    const target = $event.target as HTMLImageElement;
    target.src = defaultMaterial.image.url; // Fallback image
  };
  constructor() {
    if (this.object && this.object.image && this.object.image.photographer) {
      this.photographer = {
        username: this.object.image.photographer.username,
        profile_url: this.object.image.photographer.profile_url,
      };
      this.src = this.object.image.url;
      this.alt = `Photo of ${this.object.meta.name}`;
    }
  }
}
