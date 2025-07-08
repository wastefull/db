import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatienceComponent } from './patience.component';

describe('PatienceComponent', () => {
  let component: PatienceComponent;
  let fixture: ComponentFixture<PatienceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatienceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
