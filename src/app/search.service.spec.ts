import { TestBed } from '@angular/core/testing';
import { SearchService } from './search.service';
import { configureTestingModule } from './testing/test-setup';

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(() => {
    configureTestingModule(null, [SearchService]);
    service = TestBed.inject(SearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
