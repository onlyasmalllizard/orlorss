import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {FeedService} from "./services/feed.service";
import {feedServiceMock} from "./utils/testing/service-mocks/feed-service.mock";

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
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
