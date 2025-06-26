import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './home/header/header.component';
import { PillgroupComponent } from './home/pillgroup/pillgroup.component';
import { SocialsComponent } from './shared/socials/socials.component';
// import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { WindowComponent } from './theming/window/window.component';
import { AppWindow, sampleWindows } from './theming/window/window'; // Make sure AppWindow is a class, not just a type
import { CommonModule } from '@angular/common';
import { WindowService } from './theming/window/window.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    HeaderComponent,
    PillgroupComponent,
    SocialsComponent,
    // RouterModule,
    IonicModule,
    WindowComponent,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  // styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'Wastefull';
  windows: AppWindow[] = [];
  constructor(private windowService: WindowService, private router: Router) {
    this.router.events.subscribe((event) => {
      console.log(event);
    });
  }
  ngOnInit() {
    this.windowService.windows$.subscribe((windows) => {
      this.windows = windows;
    });
    // Activate both primary and search outlets on load
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

  // Call this from ResultsComponent instead of navigating directly:
  requestNavigation(outletName: string, path: any) {
    this.pendingNavigation[outletName] = path;
    this.tryNavigate(outletName);
  }

  private tryNavigate(outletName: string) {
    const nav = this.pendingNavigation[outletName];
    if (this.outletIsReady[outletName] && nav) {
      console.log('Navigating:', { [outletName]: nav });
      this.router.navigate([{ outlets: { [outletName]: nav } }], {
        relativeTo: this.router.routerState.root,
      });
      delete this.pendingNavigation[outletName];
    }
  }
}
