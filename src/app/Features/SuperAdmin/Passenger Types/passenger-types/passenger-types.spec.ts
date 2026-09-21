import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerTypes } from './passenger-types';

describe('PassengerTypes', () => {
  let component: PassengerTypes;
  let fixture: ComponentFixture<PassengerTypes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassengerTypes],
    }).compileComponents();

    fixture = TestBed.createComponent(PassengerTypes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
