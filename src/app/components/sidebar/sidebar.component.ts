import { Component } from '@angular/core';
import {ContentFilterComponent} from "../content-filter/content-filter.component";
import {AddFeedComponent} from "../add-feed/add-feed.component";

@Component({
  selector: 'app-sidebar',
  imports: [
    ContentFilterComponent,
    AddFeedComponent
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  standalone: true
})
export class SidebarComponent {}
