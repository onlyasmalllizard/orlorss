import {Component, Input, OnInit} from '@angular/core';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent, IconDefinition} from "@fortawesome/angular-fontawesome";
import {ListComponent} from "../list/list.component";
import {FeedService} from "../../services/feed.service";
import {AsyncPipe} from "@angular/common";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {debounceTime} from "rxjs";
import {SubscriptionUtils} from "../../utils/subscription-utils/subscription-utils.component";

@Component({
  selector: 'app-content-filter',
  imports: [
    FaIconComponent,
    ListComponent,
    AsyncPipe,
    ReactiveFormsModule
  ],
  templateUrl: './content-filter.component.html',
  styleUrl: './content-filter.component.scss',
  standalone: true
})
export class ContentFilterComponent extends SubscriptionUtils implements OnInit {
  /** The control to add a content filter */
  public filterControl: FormControl<string|null> = new FormControl<string|null>('');
  /** The search icon to display */
  public faMagnifyingGlass: IconDefinition = faMagnifyingGlass;

  /** The amount of time to debounce the automatic search by */
  @Input() public debounceBy = 800;

  constructor(public readonly feedService: FeedService) {
    super();
  }

  /**
   * Subscribes to the form control and updates the filters as the value changes
   */
  public ngOnInit() {
    this._subs.add(
      this.filterControl.valueChanges.pipe(
        debounceTime(this.debounceBy)
      ).subscribe(change => {
        this.feedService.updateFilters(change)
      })
    );
  }
}
