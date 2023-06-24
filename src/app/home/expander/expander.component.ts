import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-expander',
  templateUrl: './expander.component.html',
  styleUrls: ['./expander.component.css']
})
export class ExpanderComponent {
  @Input() icon: string;
  @Input() link: string;
  @Input() header: string;
  public expanded: boolean = false;
}
