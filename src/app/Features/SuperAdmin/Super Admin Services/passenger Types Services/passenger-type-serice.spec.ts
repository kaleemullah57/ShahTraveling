import { TestBed } from '@angular/core/testing';

import { PassengerTypeSerice } from './passenger-type-serice';

describe('PassengerTypeSerice', () => {
  let service: PassengerTypeSerice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PassengerTypeSerice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
