import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultsComponent } from './results.component';
import { WindowService } from '../../theming/window/window.service';
import { NavigationService } from '../../navigation.service';
import { Material } from '../../object/object';
import { of } from 'rxjs';

describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;
  let windowServiceSpy: jasmine.SpyObj<WindowService>;
  let navigationServiceSpy: jasmine.SpyObj<NavigationService>;

  beforeEach(async () => {
    windowServiceSpy = jasmine.createSpyObj('WindowService', [
      'hasWindow',
      'addDetailsWindow',
      'activateWindow',
      'updateWindowTitle',
    ]);
    navigationServiceSpy = jasmine.createSpyObj('NavigationService', [
      'requestNavigation',
    ]);

    await TestBed.configureTestingModule({
      imports: [ResultsComponent],
      providers: [
        { provide: WindowService, useValue: windowServiceSpy },
        { provide: NavigationService, useValue: navigationServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
    // Mock getObjects to avoid undefined everything array
    spyOn(component.objectService, 'getObjects').and.returnValue(of([]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update window title when selecting a new result and details window exists', async () => {
    const material: Material = {
      meta: { name: 'Test Material' },
      // ...TODO: finish this object with other required properties
    } as any;

    windowServiceSpy.hasWindow.and.returnValue(true);

    await component.onResultClick(material);

    expect(windowServiceSpy.activateWindow).toHaveBeenCalledWith('details');
    expect(windowServiceSpy.updateWindowTitle).toHaveBeenCalledWith(
      'details',
      'Test Material'
    );
    expect(navigationServiceSpy.requestNavigation).toHaveBeenCalledWith(
      'details',
      ['object', material.id]
    );
  });

  it('should not update window title when details window does not exist', async () => {
    const material: Material = {
      meta: { name: 'Test Material' },
      // ...other required properties as needed
    } as any;

    windowServiceSpy.hasWindow.and.returnValue(false);

    await component.onResultClick(material);

    expect(windowServiceSpy.updateWindowTitle).not.toHaveBeenCalled();
  });
});
