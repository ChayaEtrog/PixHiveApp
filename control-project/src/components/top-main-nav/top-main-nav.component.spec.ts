import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopMainNavComponent } from './top-main-nav.component';

describe('TopMainNavComponent', () => {
  let component: TopMainNavComponent;
  let fixture: ComponentFixture<TopMainNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopMainNavComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TopMainNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
