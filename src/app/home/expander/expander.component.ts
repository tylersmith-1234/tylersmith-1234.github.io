import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-expander',
  templateUrl: './expander.component.html',
  styleUrls: ['./expander.component.scss']
})
export class ExpanderComponent {
  @Input() icon: string;
  @Input() link: string;
  @Input() header: string;
  public expanded: boolean = false;
}
