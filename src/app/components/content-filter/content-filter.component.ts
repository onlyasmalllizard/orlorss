import { Component } from '@angular/core';
import {ListItemComponent} from "../list-item/list-item.component";
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent, IconDefinition} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-content-filter',
  imports: [
    ListItemComponent,
    FaIconComponent
  ],
  templateUrl: './content-filter.component.html',
  styleUrl: './content-filter.component.scss',
  standalone: true
})
export class ContentFilterComponent {
  /** The filters that are currently set */
  public filters = new Array(10).fill('test');
  /** The search icon to display */
  public faMagnifyingGlass: IconDefinition = faMagnifyingGlass;
}
