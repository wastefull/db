import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from './home/header/header.component';
import { SearchService } from './search.service';
import { SocialsComponent } from './shared/socials/socials.component';
import { AppWindow } from './theming/window/window';
import { WindowComponent } from './theming/window/window.component';
import { WindowService } from './theming/window/window.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SocialsComponent, WindowComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'Wastefull';
  windows: AppWindow[] = [];

  constructor(
    private windowService: WindowService,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.windowService.windows$.subscribe((windows) => {
      this.windows = windows;
    });
  }

  onClearSearch() {
    this.searchService.clearSearch();
  }
}
