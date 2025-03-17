import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YopMainNavComponent } from './yop-main-nav.component';

describe('YopMainNavComponent', () => {
  let component: YopMainNavComponent;
  let fixture: ComponentFixture<YopMainNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YopMainNavComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(YopMainNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
