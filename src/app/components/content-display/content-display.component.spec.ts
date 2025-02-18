import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentDisplayComponent } from './content-display.component';
import {feedServiceMock} from "../../utils/testing/service-mocks/feed-service.mock";
import {FeedService} from "../../services/feed.service";
import {of} from "rxjs";
import {mockArticle} from "../../utils/testing/data-mocks/article.mock";

const feedService = feedServiceMock({
  articles$: of([
    { ...mockArticle, id: 'a' },
    { ...mockArticle, id: 'b' }
  ])
});

describe('ContentDisplayComponent', () => {
  let component: ContentDisplayComponent;
  let fixture: ComponentFixture<ContentDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentDisplayComponent],
      providers: [
        { provide: FeedService, useValue: feedService },
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

  describe('resizeCards', () => {
    // This mock implementation sets correctly in the describe block, but not within the it block or a beforeEach
    // callback function. If I had more time, I would have investigated why this is, but alas I do not right now
    jest.spyOn(window, 'window', 'get').mockImplementation(() => ({
      getComputedStyle: () => ({
        getPropertyValue: (value: 'grid-auto-rows' | 'grid-row-gap') => {
          const propertyValues = {
            'grid-auto-rows': '5',
            'grid-row-gap': '40'
          }
          return propertyValues[value];
        }})
    } as any));

    it('should call resizeCard for each card with the correct data', () => {
      // @ts-expect-error spying on private method
      const resizeCard = jest.spyOn(component, 'resizeCard');

      // @ts-expect-error testing private method
      component.resizeCards();

      expect(resizeCard).toHaveBeenCalledTimes(2);
      expect(resizeCard).toHaveBeenCalledWith(expect.any(HTMLElement), 5, 40);
    });
  });

  describe('resizeCard', () => {
    it('sets the correct value for grid row end on the given card', () => {
      const content = {
        getBoundingClientRect: () => ({ height: 10 })
      };
      const card = {
        querySelector: jest.fn().mockReturnValue(content),
        style: {
          gridRowEnd: ''
        }
      };

      // @ts-expect-error testing private method
      component.resizeCard(card as any, 5, 5);

      expect(card.style.gridRowEnd).toBe('span 2');
    });
  });
});
