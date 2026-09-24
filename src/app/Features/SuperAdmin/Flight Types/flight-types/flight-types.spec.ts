import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightTypes } from './flight-types';

describe('FlightTypes', () => {
  let component: FlightTypes;
  let fixture: ComponentFixture<FlightTypes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightTypes],
    }).compileComponents();

    fixture = TestBed.createComponent(FlightTypes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
