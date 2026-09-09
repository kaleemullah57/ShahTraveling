import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Provinces } from './provinces';

describe('Provinces', () => {
  let component: Provinces;
  let fixture: ComponentFixture<Provinces>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Provinces],
    }).compileComponents();

    fixture = TestBed.createComponent(Provinces);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
