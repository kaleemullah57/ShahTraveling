import { TestBed } from '@angular/core/testing';

import { BranchServicesService } from './branch-services-service';

describe('BranchServicesService', () => {
  let service: BranchServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BranchServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
