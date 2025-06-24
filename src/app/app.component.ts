import { Component, OnInit } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './home/header/header.component';
import { PillgroupComponent } from './home/pillgroup/pillgroup.component';
import { SocialsComponent } from './shared/socials/socials.component';
// import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { WindowComponent } from './theming/window/window.component';
import { AppWindow, sampleWindows } from './theming/window/window'; // Make sure AppWindow is a class, not just a type
import { CommonModule } from '@angular/common';
import { WindowService } from './theming/window/window.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    // RouterOutlet,
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
  constructor(private windowService: WindowService) {}
  ngOnInit() {
    this.windowService.windows$.subscribe((windows) => {
      this.windows = windows;
    });
  }
}
