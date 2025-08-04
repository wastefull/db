import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestingModule } from '../../../../testing/test-setup';
import { ProductPickerComponent } from './product-picker.component';

describe('ProductPickerComponent', () => {
  let component: ProductPickerComponent;
  let fixture: ComponentFixture<ProductPickerComponent>;

  beforeEach(async () => {
    await configureTestingModule(ProductPickerComponent).compileComponents();

    fixture = TestBed.createComponent(ProductPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
