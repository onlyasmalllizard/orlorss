import { Component } from '@angular/core';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent, IconDefinition} from "@fortawesome/angular-fontawesome";
import {ListComponent} from "../list/list.component";
import {FeedService} from "../../services/feed.service";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-content-filter',
  imports: [
    FaIconComponent,
    ListComponent,
    AsyncPipe
  ],
  templateUrl: './content-filter.component.html',
  styleUrl: './content-filter.component.scss',
  standalone: true
})
export class ContentFilterComponent {
  /** The search icon to display */
  public faMagnifyingGlass: IconDefinition = faMagnifyingGlass;

  constructor(public readonly feedService: FeedService) {}
}
