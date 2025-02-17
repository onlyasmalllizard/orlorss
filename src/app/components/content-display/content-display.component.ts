import {
  AfterViewInit,
  Component,
  ElementRef, HostListener, Inject,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {FeedService} from "../../services/feed.service";
import {CardComponent} from "../card/card.component";
import {AsyncPipe} from "@angular/common";
import {WINDOW} from "../../providers/window.provider";

@Component({
  selector: 'app-content-display',
  imports: [
    CardComponent,
    AsyncPipe
  ],
  templateUrl: './content-display.component.html',
  styleUrl: './content-display.component.scss',
  standalone: true
})
export class ContentDisplayComponent implements AfterViewInit {
  /** The grid container for the content */
  @ViewChild('container', {read: ElementRef}) public container: ElementRef<HTMLElement>;
  /** The cards to display in the container */
  @ViewChildren(CardComponent, {read: ElementRef}) public cards: QueryList<ElementRef<HTMLElement>>;

  constructor(
    public readonly feedService: FeedService,
    @Inject(WINDOW) private readonly window: Window
  ) {}

  /**
   * Subscribes to the cards so that the content will resize on updates
   */
  public ngAfterViewInit() {
    this.cards.changes.subscribe(() => this.resizeCards());
  }

  /**
   * Gets the computed sizes of the content display container and resizes the cards based on it
   * @private
   */
  @HostListener('window:resize')
  private resizeCards(): void {
    const computedStyle = this.window.getComputedStyle(this.container.nativeElement);
    const rowHeight = parseInt(computedStyle.getPropertyValue('grid-auto-rows'));
    const rowGap = parseInt(computedStyle.getPropertyValue('grid-row-gap'));
    this.cards.forEach(card => this.resizeCard(card.nativeElement, rowHeight, rowGap));
  }

  /**
   * Calculates how many grid rows the given card should span and applies it to the card
   *
   * @param card - the card that needs the number of rows calculated
   * @param rowHeight - the height of each grid row
   * @param rowGap - the size of the gap set between each grid row
   * @private
   */
  private resizeCard(card: HTMLElement, rowHeight: number, rowGap: number): void {
    const content = card.querySelector('.content');
    if (!content) {
      return;
    }

    const contentHeight = content.getBoundingClientRect().height + rowGap;
    const totalRowHeight = rowHeight + rowGap;
    const rowSpan = Math.ceil(contentHeight / totalRowHeight);
    card.style.gridRowEnd = `span ${rowSpan}`;
  }
}
