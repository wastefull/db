import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { WindowButtonsComponent } from './window-buttons/window-buttons.component';
import { AppWindow, defaultWindow } from '../window';
import { IconRightComponent } from './icon-right/icon-right.component';
import { NavigationService } from '../../../navigation.service';
import { Subscription } from 'rxjs';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-status-bar',
  imports: [WindowButtonsComponent, IconRightComponent, IonicModule],
  templateUrl: './status-bar.component.html',
  styleUrl: './status-bar.component.scss',
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
