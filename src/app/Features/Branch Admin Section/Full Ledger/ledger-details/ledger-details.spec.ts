import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerDetails } from './ledger-details';

describe('LedgerDetails', () => {
  let component: LedgerDetails;
  let fixture: ComponentFixture<LedgerDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LedgerDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(LedgerDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
