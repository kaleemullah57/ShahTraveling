import { TestBed } from '@angular/core/testing';

import { FlightRouteTypeService } from './flight-route-type-service';

describe('FlightRouteTypeService', () => {
  let service: FlightRouteTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlightRouteTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
