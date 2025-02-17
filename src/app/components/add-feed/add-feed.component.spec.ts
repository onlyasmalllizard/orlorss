import { render } from '@testing-library/angular';
import { AddFeedComponent } from './add-feed.component';
import {FeedService} from "../../services/feed.service";
import {userEvent} from "@testing-library/user-event";
import {feedServiceMock} from "../../utils/testing/service-mocks/feed-service.mock";

const feedService = feedServiceMock();

const setup = () => render(AddFeedComponent, {
  providers: [
    { provide: FeedService, useValue: feedService }
  ]
});

describe('AddFeedComponent', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should create', async () => {
    const {fixture } = await setup();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should submit the data to the feed service if the form is valid', async () => {
    const user = userEvent.setup();
    const { getByRole } = await setup();

    await user.type(getByRole('textbox', { name: /name/i }), 'test');
    await user.type(getByRole('textbox', { name: /url/i }), 'test');

    await user.click(getByRole('button', { name: /add/i }));

    expect(feedService.addFeed).toHaveBeenCalledWith(expect.objectContaining({
      name: 'test',
      url: 'test'
    }));

    const nameInput = getByRole('textbox', { name: /name/i });
    const urlInput = getByRole('textbox', { name: /url/i });

    expect(nameInput.classList).not.toContain('error');
    expect(urlInput.classList).not.toContain('error');
  });

  it('should not submit data if the form is invalid', async () => {
    const user = userEvent.setup();
    const { getByRole } = await setup();

    const nameInput = getByRole('textbox', { name: /name/i });
    const urlInput = getByRole('textbox', { name: /url/i });

    expect(nameInput.classList).not.toContain('error');
    expect(urlInput.classList).not.toContain('error');

    await user.click(getByRole('button', { name: /add/i }));

    expect(feedService.addFeed).not.toHaveBeenCalled();

    expect(nameInput.classList).toContain('error');
    expect(urlInput.classList).toContain('error');
  });
});
