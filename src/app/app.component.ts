import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './home/header/header.component';
import { PillgroupComponent } from './home/pillgroup/pillgroup.component';
import { SocialsComponent } from './shared/socials/socials.component';
import { IonicModule } from '@ionic/angular';
import { WindowComponent } from './theming/window/window.component';
import { AppWindow } from './theming/window/window';
import { WindowService } from './theming/window/window.service';
import { Router } from '@angular/router';
import { NavigationService } from './navigation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    HeaderComponent,
    PillgroupComponent,
    SocialsComponent,
    IonicModule,
    WindowComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'Wastefull';
  windows: AppWindow[] = [];
  constructor(
    private windowService: WindowService,
    private router: Router,
    private navigationService: NavigationService
  ) {
    this.router.events.subscribe(() => {});
    this.navigationService.navigation$.subscribe(({ outlet, path }) => {
      this.requestNavigation(outlet, path);
    });
  }
  ngOnInit() {
    this.windowService.windows$.subscribe((windows) => {
      this.windows = windows;
    });
    this.router.navigate([{ outlets: { primary: null, search: null } }], {
      replaceUrl: true,
    });
  }
  private pendingNavigation: { [outlet: string]: any } = {};
  private outletIsReady: { [outlet: string]: boolean } = {};

  onOutletReady(outletName: string) {
    this.outletIsReady[outletName] = true;
    this.tryNavigate(outletName);
  }

  requestNavigation(outletName: string, path: any) {
    this.pendingNavigation[outletName] = path;
    this.tryNavigate(outletName);
  }

  private tryNavigate(outletName: string) {
    const nav = this.pendingNavigation[outletName];
    if (this.outletIsReady[outletName] && nav) {
      this.router.navigate([{ outlets: { [outletName]: nav } }], {
        relativeTo: this.router.routerState.root,
      });
      delete this.pendingNavigation[outletName];
    }
  }
}
