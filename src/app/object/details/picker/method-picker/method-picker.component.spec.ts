import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodPickerComponent } from './method-picker.component';

describe('MethodPickerComponent', () => {
  let component: MethodPickerComponent;
  let fixture: ComponentFixture<MethodPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MethodPickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MethodPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
