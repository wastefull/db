import { Component, Input } from '@angular/core';
import { ButtonComponent } from './button/button.component';
import { IconClass, ButtonInterface, defaultButtons } from './button';

@Component({
  selector: 'app-window-buttons',
  imports: [ButtonComponent],
  templateUrl: './window-buttons.component.html',
})
export class WindowButtonsComponent {
  @Input() buttons: ButtonInterface[] = defaultButtons;
  @Input() activeButton: boolean = false;
}
