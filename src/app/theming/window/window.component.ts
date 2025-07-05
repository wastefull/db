import { CommonModule, NgComponentOutlet } from '@angular/common';
import { Component, Injector, Input, OnInit } from '@angular/core';
import { StatusBarComponent } from './status-bar/status-bar.component';
import { AppWindow } from './window';

@Component({
  selector: 'app-window',
  standalone: true,
  imports: [
    CommonModule,
    NgComponentOutlet,
    StatusBarComponent,
  ],
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.scss'],
})
export class WindowComponent implements OnInit {
  @Input() window!: AppWindow;

  componentInjector!: Injector;

  constructor(private injector: Injector) {}

  ngOnInit() {
    this.componentInjector = Injector.create({
      providers: [
        {
          provide: 'WINDOW_DATA',
          useValue: this.window.componentData || {},
        },
      ],
      parent: this.injector,
    });
  }
}
