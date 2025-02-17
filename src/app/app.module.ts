import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {provideHttpClient} from "@angular/common/http";
import {SidebarComponent} from "./components/sidebar/sidebar.component";
import {ContentDisplayComponent} from "./components/content-display/content-display.component";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SidebarComponent,
    ContentDisplayComponent
  ],
  providers: [
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
