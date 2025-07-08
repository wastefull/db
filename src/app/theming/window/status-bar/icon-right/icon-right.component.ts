import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PatienceComponent } from "../../../../shared/patience/patience.component";

@Component({
  selector: 'app-icon-right',
  imports: [CommonModule, PatienceComponent],
  templateUrl: './icon-right.component.html',
})
export class IconRightComponent {
  @Input() loading: boolean = false;
}
