import {Component, Input} from '@angular/core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-list',
  imports: [
    FaIconComponent
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  standalone: true
})
export class ListComponent {
  /** The x icon for the delete button */
  public faXmark = faXmark;

  /** The items to display in the list */
  @Input() public listItems = new Array(10).fill('test');
}
