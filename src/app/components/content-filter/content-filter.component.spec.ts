import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentFilterComponent } from './content-filter.component';

describe('ContentFilterComponent', () => {
  let component: ContentFilterComponent;
  let fixture: ComponentFixture<ContentFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
