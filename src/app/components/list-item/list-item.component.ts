import {Component, EventEmitter, Output} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import { faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-list-item',
  imports: [
    FaIconComponent
  ],
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.scss',
  standalone: true
})
export class ListItemComponent {
  /** The x icon for the delete button */
  public faXmark = faXmark;

  /** The event emitter to indicate that the item should be deleted */
  @Output() public deleteItem: EventEmitter<void> = new EventEmitter<void>();
}
