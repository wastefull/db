import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-right',
  imports: [CommonModule],
  templateUrl: './icon-right.component.html',
})
export class IconRightComponent {
  @Input() loading: boolean = false;
}
