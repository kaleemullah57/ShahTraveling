import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerLedger } from './customer-ledger';

describe('CustomerLedger', () => {
  let component: CustomerLedger;
  let fixture: ComponentFixture<CustomerLedger>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerLedger],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerLedger);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
