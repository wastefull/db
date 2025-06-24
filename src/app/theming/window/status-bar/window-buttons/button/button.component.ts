import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  ButtonClass,
  ButtonInterface,
  defaultButtons,
  IconClass,
} from '../button';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() button: ButtonInterface = defaultButtons[0];

  get disabled() {
    return this.button.disabled || false;
  }
  get active() {
    return this.button.active || false;
  }
  get label() {
    return this.button.label || '';
  }
  get icon() {
    return this.button.icon || IconClass.CLOSE;
  }

  constructor() {}
  ngOnInit() {
  }
  onClick(): void {
    if (!this.disabled) {
      console.log(`Button clicked: ${this.label}`);
    }
  }
  get buttonClass(): string {
    let classes = 'button';
    if (this.disabled) {
      classes += ' disabled';
    }
    if (this.active) {
      classes += ' active';
    }

    switch (this.icon) {
      case IconClass.CLOSE:
        classes += ' ' + ButtonClass.CLOSE;
        break;
      case IconClass.MINIMIZE:
        classes += ' ' + ButtonClass.MINIMIZE;
        break;
      case IconClass.MAXIMIZE:
        classes += ' ' + ButtonClass.MAXIMIZE;
        break;
      default:
        break;
    }
    return classes;
  }
}
