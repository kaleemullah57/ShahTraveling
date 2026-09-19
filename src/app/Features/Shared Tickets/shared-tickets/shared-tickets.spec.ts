import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedTickets } from './shared-tickets';

describe('SharedTickets', () => {
  let component: SharedTickets;
  let fixture: ComponentFixture<SharedTickets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedTickets],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedTickets);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
