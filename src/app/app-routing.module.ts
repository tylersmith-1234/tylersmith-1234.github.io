import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ToxicClassificationComponent } from './toxic-classification/toxic-classification.component';
import { SpotifyQueueComponent } from './spotify-queue/spotify-queue.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'toxic-classification', component: ToxicClassificationComponent},
  {path: 'spotify-queue', component: SpotifyQueueComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 64] // [x, y]
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
