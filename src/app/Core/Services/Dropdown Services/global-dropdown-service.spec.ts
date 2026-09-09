import { TestBed } from '@angular/core/testing';

import { GlobalDropdownService } from './global-dropdown-service';

describe('GlobalDropdownService', () => {
  let service: GlobalDropdownService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalDropdownService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
