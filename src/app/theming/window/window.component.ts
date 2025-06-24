import { Component, Input } from '@angular/core';
import { IonCard, IonCardContent } from '@ionic/angular/standalone';
import { StatusBarComponent } from './status-bar/status-bar.component';
import { CommonModule } from '@angular/common';
import { ButtonInterface, IconClass } from './status-bar/window-buttons/button';
import { AppWindow, generateWindow } from './window';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-window',
  imports: [
    IonCard,
    IonCardContent,
    StatusBarComponent,
    CommonModule,
    StatusBarComponent,
    RouterOutlet,
  ],
  templateUrl: './window.component.html',
  styleUrl: './window.component.scss',
})
export class WindowComponent {
  @Input() window: AppWindow = generateWindow('Default Window');
  @Input() outletName!: string;

  constructor() {}
}
