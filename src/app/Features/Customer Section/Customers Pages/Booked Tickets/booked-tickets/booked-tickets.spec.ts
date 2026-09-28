import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookedTickets } from './booked-tickets';

describe('BookedTickets', () => {
  let component: BookedTickets;
  let fixture: ComponentFixture<BookedTickets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookedTickets],
    }).compileComponents();

    fixture = TestBed.createComponent(BookedTickets);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
