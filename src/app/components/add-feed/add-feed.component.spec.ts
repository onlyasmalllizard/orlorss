import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFeedComponent } from './add-feed.component';

describe('AddFeedComponent', () => {
  let component: AddFeedComponent;
  let fixture: ComponentFixture<AddFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFeedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
