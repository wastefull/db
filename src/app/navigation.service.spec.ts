import { TestBed } from '@angular/core/testing';
import { NavigationService } from './navigation.service';
import { configureTestingModule } from './testing/test-setup';

describe('NavigationService', () => {
  let service: NavigationService;

  beforeEach(() => {
    configureTestingModule(null, [NavigationService]);
    service = TestBed.inject(NavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
