import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestingModule } from '../testing/test-setup';
import { ImageDisplayComponent } from './image-display.component';

describe('ImageDisplayComponent', () => {
  let component: ImageDisplayComponent;
  let fixture: ComponentFixture<ImageDisplayComponent>;

  beforeEach(async () => {
    await configureTestingModule(ImageDisplayComponent).compileComponents();

    fixture = TestBed.createComponent(ImageDisplayComponent);
    component = fixture.componentInstance;

    // Set required input properties with proper Material interface
    component.object = {
      id: '1',
      meta: { name: 'Test Object', description: 'Test description' },
      image: { url: 'test.jpg', thumbnail: 'test-thumb.jpg' },
      risk: { types: [], factors: [], hazards: [] },
      updated: { datetime: '2025-01-01', user_id: 'test' },
      articles: { ids: [], compost: [], recycle: [], upcycle: [] },
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
