import { Component, Input } from '@angular/core';
import { ButtonComponent } from './button/button.component';
import { IconClass, ButtonInterface, defaultButtons } from './button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-window-buttons',
  imports: [ButtonComponent, CommonModule],
  templateUrl: './window-buttons.component.html',
  styleUrl: './window-buttons.component.scss',
})
export class WindowButtonsComponent {
  @Input() buttons: ButtonInterface[] = defaultButtons;
  @Input() activeButton: boolean = false;
}
