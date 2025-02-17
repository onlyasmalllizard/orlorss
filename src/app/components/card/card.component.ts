import {Component, Input} from '@angular/core';
import {Article} from "../../models/article.model";
import {DatePipe} from "@angular/common";
import {FaIconComponent, IconDefinition} from "@fortawesome/angular-fontawesome";
import {faArrowUpRightFromSquare} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-card',
  imports: [
    DatePipe,
    FaIconComponent
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  standalone: true
})
export class CardComponent {
  /** The icon to display next to the link to the article */
  public externalLinkIcon: IconDefinition = faArrowUpRightFromSquare;

  /** The article to display on the card */
  @Input() public article!: Article;
}
