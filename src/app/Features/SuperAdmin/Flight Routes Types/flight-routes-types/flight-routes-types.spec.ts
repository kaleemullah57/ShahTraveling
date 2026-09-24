import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightRoutesTypes } from './flight-routes-types';

describe('FlightRoutesTypes', () => {
  let component: FlightRoutesTypes;
  let fixture: ComponentFixture<FlightRoutesTypes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightRoutesTypes],
    }).compileComponents();

    fixture = TestBed.createComponent(FlightRoutesTypes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
