import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import {
  provideClientHydration,
  provideProtractorTestingSupport,
  withEventReplay,
} from '@angular/platform-browser';
import { provideIonicAngular } from '@ionic/angular/standalone';
export const appConfig: ApplicationConfig = {
  providers: [
    provideProtractorTestingSupport(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay()),
    provideIonicAngular({
      mode: 'ios', // Use 'md' for Material Design or 'ios' for iOS style
      animated: true, // Enable animations
      swipeBackEnabled: true, // Enable swipe back gesture
      hardwareBackButton: true, // Enable hardware back button support
      innerHTMLTemplatesEnabled: true, // Enable inner HTML templates
      tabButtonLayout: 'icon-bottom', // Layout for tab buttons
    }),
  ],
};
