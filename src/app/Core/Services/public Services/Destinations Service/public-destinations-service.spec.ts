import { TestBed } from '@angular/core/testing';

import { PublicDestinationsService } from './public-destinations-service';

describe('PublicDestinationsService', () => {
  let service: PublicDestinationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicDestinationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
