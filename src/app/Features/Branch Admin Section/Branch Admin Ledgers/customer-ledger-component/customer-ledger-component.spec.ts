import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerLedgerComponent } from './customer-ledger-component';

describe('CustomerLedgerComponent', () => {
  let component: CustomerLedgerComponent;
  let fixture: ComponentFixture<CustomerLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerLedgerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerLedgerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
