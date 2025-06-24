import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconRightComponent } from './icon-right.component';

describe('IconRightComponent', () => {
  let component: IconRightComponent;
  let fixture: ComponentFixture<IconRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconRightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
