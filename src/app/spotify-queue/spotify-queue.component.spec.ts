import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotifyQueueComponent } from './spotify-queue.component';

describe('SpotifyQueueComponent', () => {
  let component: SpotifyQueueComponent;
  let fixture: ComponentFixture<SpotifyQueueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpotifyQueueComponent]
    });
    fixture = TestBed.createComponent(SpotifyQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
