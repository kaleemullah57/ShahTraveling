import { TestBed } from '@angular/core/testing';

import { AirportsServices } from './airports-services';

describe('AirportsServices', () => {
  let service: AirportsServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AirportsServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
