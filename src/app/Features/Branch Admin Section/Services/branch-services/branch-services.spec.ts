import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchServices } from './branch-services';

describe('BranchServices', () => {
  let component: BranchServices;
  let fixture: ComponentFixture<BranchServices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchServices],
    }).compileComponents();

    fixture = TestBed.createComponent(BranchServices);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
