import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NgbScrollSpyService } from '@ng-bootstrap/ng-bootstrap';

/**
 * Common test configuration for Angular components that provides:
 * - HttpClient for API calls
 * - Router for navigation
 * - NgBootstrap services
 */
export function configureTestingModule(
  component: any,
  additionalProviders: any[] = []
) {
  const providers = [
    provideHttpClient(),
    provideHttpClientTesting(),
    provideRouter([]), // Empty routes for testing
    NgbScrollSpyService,
    ...additionalProviders,
  ];

  // For components, include them in imports
  // For services, just use providers
  if (component) {
    return TestBed.configureTestingModule({
      imports: [component],
      providers,
    });
  } else {
    return TestBed.configureTestingModule({
      providers,
    });
  }
}
