import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-icon-right',
  imports: [CommonModule, IonicModule],
  templateUrl: './icon-right.component.html',
})
export class IconRightComponent {
  @Input() loading: boolean = false;
}
