import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {FeedService} from "./services/feed.service";
import {feedServiceMock} from "./utils/testing/service-mocks/feed-service.mock";
import {SidebarComponent} from "./components/sidebar/sidebar.component";
import {ContentDisplayComponent} from "./components/content-display/content-display.component";

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        SidebarComponent,
        ContentDisplayComponent
      ],
      providers: [
        { provide: FeedService, useValue: feedServiceMock() }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
