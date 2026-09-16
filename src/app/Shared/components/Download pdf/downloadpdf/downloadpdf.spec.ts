import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Downloadpdf } from './downloadpdf';

describe('Downloadpdf', () => {
  let component: Downloadpdf;
  let fixture: ComponentFixture<Downloadpdf>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Downloadpdf],
    }).compileComponents();

    fixture = TestBed.createComponent(Downloadpdf);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
