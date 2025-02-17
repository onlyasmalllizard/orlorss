import {Component, OnInit} from '@angular/core';
import {FeedService} from "./services/feed.service";
import {SubscriptionUtils} from "./utils/subscription-utils/subscription-utils.component";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent extends SubscriptionUtils implements OnInit {
  constructor(
    public readonly feedService: FeedService
  ) {
    super();
  }

  /**
   * Fetches the content from the rss api
   */
  public ngOnInit() {
    this._subs.add(
      this.feedService.fetchContent().subscribe()
    );
  }
}
