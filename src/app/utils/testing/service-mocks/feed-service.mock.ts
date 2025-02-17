import {of} from "rxjs";
import {FeedService} from "../../../services/feed.service";

export const feedServiceMock = (config: Partial<FeedService> = {}) => ({
  articles$: of([]),
  sources$: of([]),
  addFeed: jest.fn(),
  deleteFeed: jest.fn(),
  updateFilters: jest.fn(),
  ...config
});
