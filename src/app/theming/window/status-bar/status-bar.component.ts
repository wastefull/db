import { Component, Input } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from '@ionic/angular/standalone';
import { WindowButtonsComponent } from './window-buttons/window-buttons.component';
import { CommonModule } from '@angular/common';
import { AppWindow, defaultWindow } from '../window';
import { IconRightComponent } from './icon-right/icon-right.component';
@Component({
  selector: 'app-status-bar',
  imports: [
    IonCardHeader,
    WindowButtonsComponent,
    CommonModule,
    IconRightComponent,
  ],
  templateUrl: './status-bar.component.html',
  styleUrl: './status-bar.component.scss',
})
export class StatusBarComponent {
  @Input() window: AppWindow = defaultWindow;
  // buttons!: AppWindow['buttons'];
  // title!: AppWindow['title'];
  // activeButton: AppWindow['activeButton'];
  loading: boolean = true;

  ngOnInit() {
    this.update();
  }
  ngOnChanges() {
    this.update();
  }

  update() {
    if (this.window !== defaultWindow) {
      this.loading = false;
    } else {
      this.loading = true;
    }
  }
}
