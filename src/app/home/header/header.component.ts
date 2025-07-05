import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SearchService } from '../../search.service';
import { LogoComponent } from '../../shared/logo/logo.component';
import { WindowService } from '../../theming/window/window.service';

@Component({
  selector: 'app-header',
  imports: [LogoComponent, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() title = '';
  @Output() clearSearch = new EventEmitter<void>();

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
