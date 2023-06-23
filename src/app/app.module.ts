import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToxicClassificationComponent } from './toxic-classification/toxic-classification.component';
import { HomeComponent } from './home/home.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { SpotifyQueueComponent } from './spotify-queue/spotify-queue.component';
import { ExpanderComponent } from './home/expander/expander.component';

@NgModule({
  declarations: [
    AppComponent,
    ToxicClassificationComponent,
    HomeComponent,
    AppHeaderComponent,
    SpotifyQueueComponent,
    ExpanderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
