import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {FeedService} from "../../services/feed.service";
import {Source} from "../../models/source.model";

@Component({
  selector: 'app-add-feed',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './add-feed.component.html',
  styleUrl: './add-feed.component.scss',
  standalone: true
})
export class AddFeedComponent {
  /** The form for the feed data */
  public addFeedForm: FormGroup<{
    name: FormControl<string|null>,
    url: FormControl<string|null>
  }> = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    url: new FormControl<string>('', Validators.required)
  });

  constructor(private readonly feedService: FeedService) {}

  /**
   * Checks the form for validity and adds the new feed if it passes
   */
  public submit(): void {
    this.addFeedForm.updateValueAndValidity();
    if (this.addFeedForm.valid) {
      this.feedService.addFeed({
        ...this.addFeedForm.getRawValue() as Source
      });
    }
  }
}
