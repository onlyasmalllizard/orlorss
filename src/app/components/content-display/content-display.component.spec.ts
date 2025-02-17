import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentDisplayComponent } from './content-display.component';
import {feedServiceMock} from "../../utils/testing/service-mocks/feed-service.mock";
import {FeedService} from "../../services/feed.service";

const feedService = feedServiceMock();

describe('ContentDisplayComponent', () => {
  let component: ContentDisplayComponent;
  let fixture: ComponentFixture<ContentDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentDisplayComponent],
      providers: [
        { provide: FeedService, useValue: feedService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
