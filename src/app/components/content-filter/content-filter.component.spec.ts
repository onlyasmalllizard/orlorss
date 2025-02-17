import {render} from "@testing-library/angular";
import {ContentFilterComponent} from "./content-filter.component";
import {feedServiceMock} from "../../utils/testing/service-mocks/feed-service.mock";
import {FeedService} from "../../services/feed.service";
import {userEvent} from "@testing-library/user-event";

const feedService = feedServiceMock();

const setup = () => render(ContentFilterComponent, {
  providers: [
    { provide: FeedService, useValue: feedService }
  ],
  inputs: {
    debounceBy: 0
  }
});

describe('ContentFilterComponent', () => {
  it('should create', async () => {
    const { fixture } = await setup();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should send the value to the feed service when the user types it in', async () => {
    const user = userEvent.setup();
    const { getByRole } = await setup();

    await user.type(getByRole('textbox', { name: /filter/i }), 'test');

    expect(feedService.updateFilters).toHaveBeenCalledWith('test');
  });
});
