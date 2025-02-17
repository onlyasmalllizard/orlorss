import {Component, OnDestroy} from '@angular/core';
import {Subscription} from "rxjs";

@Component({
  template: '',
  standalone: true
})
export class SubscriptionUtils implements OnDestroy {
  /** Array of subscriptions to unsubscribe from */
  public _subs: Subscription = new Subscription();

  /**
   * Upon destruction of the component, it unsubscribes from all subscriptions in the array
   */
  public ngOnDestroy(): void {
    this._subs.unsubscribe();
  }
}
