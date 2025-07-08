import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  NgbScrollSpyModule,
  NgbScrollSpyService,
} from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { HeaderComponent } from './home/header/header.component';
import { SearchService } from './search.service';
import { ContentReadyService } from './shared/content-ready.service';
import { SocialsComponent } from './shared/socials/socials.component';
import { AppWindow } from './theming/window/window';
import { WindowComponent } from './theming/window/window.component';
import { WindowService } from './theming/window/window.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SocialsComponent,
    WindowComponent,
    NgbScrollSpyModule,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'Wastefull';
  windows: AppWindow[] = [];
  private previousWindowCount = 0;
  private windowsSubscription?: Subscription;
  private scrollSpySubscription?: Subscription;
  private contentReadySubscription?: Subscription;
  private pendingScrollWindowId?: string;

  constructor(
    private windowService: WindowService,
    private searchService: SearchService,
    private scrollSpyService: NgbScrollSpyService,
    private contentReadyService: ContentReadyService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.windowsSubscription = this.windowService.windows$.subscribe(
      (windows) => {
        const newWindowCount = windows.length;

        // Check if a new window was added or if the active window changed
        if (newWindowCount > this.previousWindowCount && newWindowCount > 1) {
          const newestWindow = windows[windows.length - 1];
          // console.log('New window detected:', newestWindow.id);

          // Set the new window as loading and store for scroll
          this.contentReadyService.setWindowLoading(newestWindow.id, true);
          this.pendingScrollWindowId = newestWindow.id;
        } else {

          const activeWindow = windows.find((w) => w.isActive);
          if (activeWindow && activeWindow.id !== this.pendingScrollWindowId) {
            // console.log('Active window changed to:', activeWindow.id);
            this.pendingScrollWindowId = activeWindow.id;
          }
        }

        this.windows = windows;
        this.previousWindowCount = newWindowCount;
        this.cdr.detectChanges();
      }
    );

    // Listen for content ready notifications
    this.contentReadySubscription =
      this.contentReadyService.contentReady$.subscribe((windowId) => {
        // console.log('Content ready notification received for:', windowId);

        // If this is the window we're waiting to scroll to
        if (this.pendingScrollWindowId === windowId) {
          // console.log('Scrolling to window after content ready:', windowId);

          this.cdr.detectChanges();

          setTimeout(() => {
            this.scrollToActiveWindow();
          }, 200); 

          this.pendingScrollWindowId = undefined;
        }
      });
  }

  ngAfterViewInit() {
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      try {
        // Start scroll spy service - it will automatically use the directive config
        this.scrollSpyService.start();
        // console.log('ScrollSpy service started');

        // Subscribe to scroll spy events
        this.scrollSpySubscription = this.scrollSpyService.active$.subscribe(
          (fragment) => {
            if (fragment) {
              // console.log('Currently viewing window:', fragment);
            }
          }
        );
      } catch (error) {
        // console.warn('ScrollSpy initialization failed:', error);
      }
    }, 100);
  }

  ngOnDestroy() {
    this.windowsSubscription?.unsubscribe();
    this.scrollSpySubscription?.unsubscribe();
    this.contentReadySubscription?.unsubscribe();

    try {
      this.scrollSpyService.stop();
    } catch (error) {
      console.warn('ScrollSpy stop error:', error);
    }
  }

  onClearSearch() {
    this.searchService.clearSearch();
  }

  // Handle active fragment changes from the directive
  onActiveFragmentChange(fragmentId: string) {
    // console.log('Active fragment changed to:', fragmentId);
  }

  private scrollToActiveWindow() {
    // Find the active window
    const activeWindow = this.windows.find((w) => w.isActive);
    if (!activeWindow) {
      // console.log('No active window found');
      return;
    }

    // console.log('Scrolling to active window:', activeWindow.id);
    this.scrollToWindow(activeWindow.id);
  }

  private scrollToWindow(windowId: string) {
    this.waitForElement(windowId, 10).then((element) => {
      if (element) {
        // console.log('Element found, proceeding with smooth scroll:', element.id);
        this.performSmoothScroll(windowId, element);
      } else {
        console.error('Element not found after all retries:', windowId);
        this.debugAvailableElements();
      }
    });
  }

  private async waitForElement(
    elementId: string,
    maxRetries: number
  ): Promise<HTMLElement | null> {
    for (let i = 0; i < maxRetries; i++) {
      // Force change detection before each attempt
      this.cdr.detectChanges();

      // Wait for next tick
      await new Promise((resolve) => requestAnimationFrame(resolve));

      const element = document.getElementById(elementId);

      if (element) {
        // console.log(`Element found on attempt ${i + 1}:`, elementId);
        return element;
      }

      // console.log(
      //   `Element not found, attempt ${i + 1}/${maxRetries}:`,
      //   elementId
      // );

      // Debug: Show what elements ARE available
      // if (i % 3 === 0) {
      //   this.debugAvailableElements();
      // }

      // Wait before next attempt
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return null;
  }

  private debugAvailableElements() {
    const allElements = document.querySelectorAll('[id]');
    // console.log(
    //   'All elements with IDs:',
    //   Array.from(allElements).map((el) => el.id)
    // );
    // console.log('Current windows array:', this.windows.map((w) => w.id));
    // console.log('Active window:', this.windows.find((w) => w.isActive)?.id);
  }

  private performSmoothScroll(windowId: string, element: HTMLElement) {
    const contentContainer = document.querySelector('.content') as HTMLElement;

    if (contentContainer) {
      const containerRect = contentContainer.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      // Show the top half of the window
      // This positions the element so its middle is at the top 1/3 of the viewport
      const targetScrollTop =
        contentContainer.scrollTop +
        elementRect.top -
        containerRect.top -
        containerRect.height / 3; // Show top half of window

      // console.log('Smooth scroll calculation:', {
      //   containerHeight: containerRect.height,
      //   elementTop: elementRect.top,
      //   elementHeight: elementRect.height,
      //   targetScrollTop,
      // });

      contentContainer.scrollTo({
        top: Math.max(0, targetScrollTop), // Don't scroll past top
        behavior: 'smooth',
      });

      setTimeout(() => {
        this.highlightWindow(element);
      }, 300); // Wait for scroll to settle
    } else {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start', // Position at top of viewport
        inline: 'nearest',
      });
      this.highlightWindow(element);
    }
  }

  private highlightWindow(element: HTMLElement) {
    element.classList.add('window-highlight');

    setTimeout(() => {
      element.classList.remove('window-highlight');
    }, 2000);
  }
}
