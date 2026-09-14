import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalCard } from './global-card';

describe('GlobalCard', () => {
  let component: GlobalCard;
  let fixture: ComponentFixture<GlobalCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalCard],
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
