import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SearchService } from '../../search.service';
import { LogoComponent } from '../../shared/logo/logo.component';
import { WindowService } from '../../theming/window/window.service';
import { SocialsComponent } from '../../shared/socials/socials.component';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  imports: [LogoComponent, RouterModule, SocialsComponent, NgbCollapseModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() title = '';
  @Output() clearSearch = new EventEmitter<void>();
  isMenuCollapsed = true;

  constructor(
    private router: Router,
    private windowService: WindowService,
    private searchService: SearchService
  ) {}

  async resetApp() {
    // Clear search query
    this.searchService.clearSearch();

    // Reset windows to default state
    await this.windowService.resetToDefault();

    // Emit clear search event to parent
    this.clearSearch.emit();

    // Navigate to root and clear all outlets
    this.router.navigate(
      [{ outlets: { primary: null, search: null, details: null } }],
      { replaceUrl: true }
    );
  }
}
