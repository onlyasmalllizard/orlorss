import {Component, Input} from '@angular/core';
import {Article} from "../../models/article.model";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-card',
  imports: [
    DatePipe
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  standalone: true
})
export class CardComponent {
  /** The article to display on the card */
  @Input() public article!: Article;
}
