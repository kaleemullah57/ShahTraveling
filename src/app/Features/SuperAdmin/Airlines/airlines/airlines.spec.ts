import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Airlines } from './airlines';

describe('Airlines', () => {
  let component: Airlines;
  let fixture: ComponentFixture<Airlines>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Airlines],
    }).compileComponents();

    fixture = TestBed.createComponent(Airlines);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
