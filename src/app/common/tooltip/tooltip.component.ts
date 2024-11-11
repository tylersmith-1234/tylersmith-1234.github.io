import { Component, OnInit } from '@angular/core';
import { TooltipPosition } from './tooltip/tooltip.enum';
import { TypePipe } from '../pipes/type-pipe/type.pipe';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent implements OnInit {
  tooltip: any = '';
  isTooltipArray: boolean = false;
  left: number = 0;
  top: number = 0;
  position: TooltipPosition = TooltipPosition.DEFAULT;

  constructor() {}

  ngOnInit(): void {
    this.isTooltipArray = Array.isArray(this.tooltip);
  }
}
