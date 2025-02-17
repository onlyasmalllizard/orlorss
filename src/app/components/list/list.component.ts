import {Component, EventEmitter, Input, Output} from '@angular/core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {Source} from "../../models/source.model";

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
  @Input() public listItems: Source[] = [];
  /** The event emitter to delete an item from the list */
  @Output() public deleteItem: EventEmitter<Source> = new EventEmitter<Source>();
}
