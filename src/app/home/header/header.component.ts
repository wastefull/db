import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { WindowService } from '../../theming/window/window.service';
import { LogoComponent } from '../../shared/logo/logo.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [LogoComponent, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() title = '';

  constructor(private router: Router, private windowService: WindowService) {}

  resetApp() {
    // Reset windows to initial state
    this.windowService.setDefaultWindows();
    // Navigate to root and clear all outlets
    this.router.navigate(
      [{ outlets: { primary: null, search: null, details: null } }],
      { replaceUrl: true }
    );
  }
}
