import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PillgroupComponent } from './pillgroup.component';

describe('PillgroupComponent', () => {
  let component: PillgroupComponent;
  let fixture: ComponentFixture<PillgroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PillgroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PillgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
