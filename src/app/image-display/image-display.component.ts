import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { defaultMaterial, Material } from '../object/object';

@Component({
  selector: 'app-image-display',
  imports: [CommonModule],
  templateUrl: './image-display.component.html',
  styleUrls: ['./image-display.component.scss'],
  standalone: true,
})
export class ImageDisplayComponent {
  @Input() object!: Material;
  @Input() imageUrl: string = '';
  @Input() altText: string = '';

  photographer: { username: string; profile_url: string } | null = null;
  src = '';
  alt = '';

  ngOnInit() {
    // Use direct inputs if provided, otherwise fall back to object properties
    if (this.imageUrl && this.altText) {
      this.src = this.imageUrl;
      this.alt = this.altText;
      this.photographer = null; // No photographer info when using direct URL
    } else if (this.object && this.object.image) {
      this.src = this.object.image.url;
      this.alt = `Photo of ${this.object.meta.name}`;

      if (this.object.image.photographer) {
        this.photographer = {
          username: this.object.image.photographer.username,
          profile_url: this.object.image.photographer.profile_url,
        };
      }
    } else {
      this.src = defaultMaterial.image.url;
      this.alt = 'Default image';
      this.photographer = null;
    }
  }

  handleMissingImage = ($event: ErrorEvent): void => {
    const target = $event.target as HTMLImageElement;
    target.src = defaultMaterial.image.url;
    this.photographer = null; // Remove credit for fallback image
  };
}
