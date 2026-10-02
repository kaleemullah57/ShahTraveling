import { TestBed } from '@angular/core/testing';

import { HoldConfirmCancelService } from './hold-confirm-cancel-service';

describe('HoldConfirmCancelService', () => {
  let service: HoldConfirmCancelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HoldConfirmCancelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
