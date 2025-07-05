import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../../navigation.service';
import { AppWindow, defaultWindow } from '../window';
import { IconRightComponent } from './icon-right/icon-right.component';
import { WindowButtonsComponent } from './window-buttons/window-buttons.component';

@Component({
  selector: 'app-status-bar',
  imports: [CommonModule, WindowButtonsComponent, IconRightComponent],
  templateUrl: './status-bar.component.html',
})
export class StatusBarComponent implements OnInit, OnDestroy {
  @Input() window: AppWindow = defaultWindow;
  loading: boolean = false;

  private loadingSub?: Subscription;

  constructor(private navigationService: NavigationService) {}

  ngOnInit() {
    this.loadingSub = this.navigationService.loading$.subscribe((loading) => {
      this.loading = loading;
    });
  }

  ngOnDestroy() {
    this.loadingSub?.unsubscribe();
  }
}
