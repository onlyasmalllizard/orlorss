import {render} from "@testing-library/angular";
import {ListComponent} from "./list.component";
import {userEvent} from "@testing-library/user-event";

const setup = () => render(ListComponent, {
  inputs: {
    listItems: [
      { name: 'a', url: 'a' },
      { name: 'b', url: 'b' }
    ]
  }
});

describe('ListComponent', () => {
  it('should create', async () => {
    const { fixture } = await setup();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the given list items', async () => {
    const { fixture, getAllByRole } = await setup();
    const component = fixture.componentInstance;

    const listItems = getAllByRole('listitem');
    expect(component.listItems.length).toBe(listItems.length);

    fixture.componentInstance.listItems.forEach(listItem => {
      const listItemIsRendered = !!listItems.find(li => li.textContent?.match(new RegExp(listItem.name)));
      expect(listItemIsRendered).toBe(true);
    });
  });

  it('should emit the delete action with the correct data when a delete item is clicked', async () => {
    const user = userEvent.setup();
    const { fixture, getByRole } = await setup();
    const deleteItem = jest.spyOn(fixture.componentInstance.deleteItem, 'emit');

    await user.click(getByRole('button', { name: /a/i }));

    expect(deleteItem).toHaveBeenCalledWith(expect.objectContaining({
      name: 'a',
      url: 'a'
    }));
  });
});
