import { ComponentFixture, TestBed } from '@angular/core/testing';
import { defaultButtons } from './status-bar/window-buttons/button';
import { AppWindow } from './window';
import { WindowComponent } from './window.component';

describe('WindowComponent', () => {
  let component: WindowComponent;
  let fixture: ComponentFixture<WindowComponent>;

  const mockWindow: AppWindow = {
    id: 'test',
    title: 'Test Window',
    icon: 'fa-test',
    isActive: true,
    isMinimized: false,
    isMaximized: false,
    buttons: defaultButtons,
    component: undefined,
    componentData: {},
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WindowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WindowComponent);
    component = fixture.componentInstance;
    component.window = mockWindow; // Set the required input
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
