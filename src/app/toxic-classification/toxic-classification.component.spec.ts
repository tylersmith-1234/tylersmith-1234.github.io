import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToxicClassificationComponent } from './toxic-classification.component';

describe('ToxicClassificationComponent', () => {
  let component: ToxicClassificationComponent;
  let fixture: ComponentFixture<ToxicClassificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToxicClassificationComponent]
    });
    fixture = TestBed.createComponent(ToxicClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
