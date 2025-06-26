import {
  Component,
  Input,
  AfterViewInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { IonCard, IonCardContent } from '@ionic/angular/standalone';
import { StatusBarComponent } from './status-bar/status-bar.component';
import { CommonModule } from '@angular/common';
import { AppWindow, generateWindow } from './window';
import { RouterOutlet, RouterModule } from '@angular/router';
@Component({
  selector: 'app-window',
  standalone: true,
  imports: [
    IonCard,
    IonCardContent,
    StatusBarComponent,
    CommonModule,
    StatusBarComponent,
    RouterOutlet,
    RouterModule,
  ],
  templateUrl: './window.component.html',
  styleUrl: './window.component.scss',
})
export class WindowComponent implements AfterViewInit {
  @Input() window: AppWindow = generateWindow('Default Window');
  @Input() outletName!: string;

  @Output() outletReady = new EventEmitter<string>();
  @Output() requestNavigation = new EventEmitter<{
    outlet: string;
    path: any;
  }>();
  @ViewChild('outlet', { static: false, read: ElementRef })
  outletRef!: ElementRef;

  constructor() {}

  ngAfterViewInit() {
    setTimeout(() => {
      console.log('Window outlet:', this.window.outlet);
      this.outletReady.emit(this.window.outlet);
    });
  }

  onRequestNavigation(event: { outlet: string; path: any }) {
    this.requestNavigation.emit(event);
  }
}
