import { TestBed } from '@angular/core/testing';

import { TicketRealtimeService } from './ticket-realtime-service';

describe('TicketRealtimeService', () => {
  let service: TicketRealtimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketRealtimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
