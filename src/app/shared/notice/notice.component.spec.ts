import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { NoticeComponent } from './notice.component';

describe('NoticeComponent', () => {
  let component: NoticeComponent;
  let fixture: ComponentFixture<NoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the notice text', () => {
    const noticeElement = fixture.debugElement.query(
      By.css('body, :host, *')
    ).nativeElement;
    expect(noticeElement.textContent).toContain(
      'TEST DATA ONLY DURING BETA - DO NOT'
    );
  });
});
