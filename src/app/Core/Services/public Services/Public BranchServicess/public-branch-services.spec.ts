import { TestBed } from '@angular/core/testing';

import { PublicBranchServices } from './public-branch-services';

describe('PublicBranchServices', () => {
  let service: PublicBranchServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicBranchServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
