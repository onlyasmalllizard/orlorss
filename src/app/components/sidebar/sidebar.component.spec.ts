import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarComponent } from './sidebar.component';
import {ContentFilterComponent} from "../content-filter/content-filter.component";
import {AddFeedComponent} from "../add-feed/add-feed.component";
import {FeedService} from "../../services/feed.service";
import {feedServiceMock} from "../../utils/testing/service-mocks/feed-service.mock";

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SidebarComponent,
        ContentFilterComponent,
        AddFeedComponent
      ],
      providers: [
        { provide: FeedService, useValue: feedServiceMock() }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
