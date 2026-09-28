import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerTypePrice } from './passenger-type-price';

describe('PassengerTypePrice', () => {
  let component: PassengerTypePrice;
  let fixture: ComponentFixture<PassengerTypePrice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassengerTypePrice],
    }).compileComponents();

    fixture = TestBed.createComponent(PassengerTypePrice);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
