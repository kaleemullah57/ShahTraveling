import { TestBed } from '@angular/core/testing';

import { FlightTypeService } from './flight-type-service';

describe('FlightTypeService', () => {
  let service: FlightTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlightTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
