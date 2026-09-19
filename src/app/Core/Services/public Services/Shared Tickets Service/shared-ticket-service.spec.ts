import { TestBed } from '@angular/core/testing';

import { SharedTicketService } from './shared-ticket-service';

describe('SharedTicketService', () => {
  let service: SharedTicketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedTicketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
