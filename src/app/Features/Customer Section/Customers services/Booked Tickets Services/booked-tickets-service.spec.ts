import { TestBed } from '@angular/core/testing';

import { BookedTicketsService } from './booked-tickets-service';

describe('BookedTicketsService', () => {
  let service: BookedTicketsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookedTicketsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
