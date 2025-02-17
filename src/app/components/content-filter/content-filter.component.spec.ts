import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentFilterComponent } from './content-filter.component';
import {ListComponent} from "../list/list.component";
import {FeedService} from "../../services/feed.service";
import {feedServiceMock} from "../../utils/testing/service-mocks/feed-service.mock";

describe('ContentFilterComponent', () => {
  let component: ContentFilterComponent;
  let fixture: ComponentFixture<ContentFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ContentFilterComponent,
        ListComponent
      ],
      providers: [
        { provide: FeedService, useValue: feedServiceMock() }
      ]
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
