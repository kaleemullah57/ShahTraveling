import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableTickets } from './available-tickets';

describe('AvailableTickets', () => {
  let component: AvailableTickets;
  let fixture: ComponentFixture<AvailableTickets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailableTickets],
    }).compileComponents();

    fixture = TestBed.createComponent(AvailableTickets);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
