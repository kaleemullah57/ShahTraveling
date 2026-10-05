import { TestBed } from '@angular/core/testing';

import { CustomerLedgerService } from './customer-ledger-service';

describe('CustomerLedgerService', () => {
  let service: CustomerLedgerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerLedgerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
