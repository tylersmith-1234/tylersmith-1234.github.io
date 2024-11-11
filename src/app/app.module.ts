import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToxicClassificationComponent } from './toxic-classification/toxic-classification.component';
import { HomeComponent } from './home/home.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { SpotifyQueueComponent } from './spotify-queue/spotify-queue.component';
import { ExpanderComponent } from './home/expander/expander.component';
import { CookbookComponent } from './cookbook/cookbook.component';
import { FormControl, FormGroup } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { TooltipComponent } from './common/tooltip/tooltip.component';
import { TooltipModule } from './common/tooltip/tooltip.module';
import { TabContentComponent } from './common/tab-content/tab-content.component';
import { TabContainerComponent } from './common/tab-container/tab-container.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [
    AppComponent,
    ToxicClassificationComponent,
    HomeComponent,
    AppHeaderComponent,
    SpotifyQueueComponent,
    ExpanderComponent,
    CookbookComponent,
    TabContentComponent,
    TabContainerComponent,
    // TooltipComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule,
    PdfViewerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
