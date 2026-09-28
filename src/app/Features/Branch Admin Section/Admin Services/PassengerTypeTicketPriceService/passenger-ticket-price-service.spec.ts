import { TestBed } from '@angular/core/testing';

import { PassengerTicketPriceService } from './passenger-ticket-price-service';

describe('PassengerTicketPriceService', () => {
  let service: PassengerTicketPriceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PassengerTicketPriceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
