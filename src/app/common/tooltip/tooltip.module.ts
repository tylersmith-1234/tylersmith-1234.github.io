import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipComponent } from './tooltip.component';
import { TooltipDirective } from './tooltip/tooltip.component';
import { TypePipe } from '../pipes/type-pipe/type.pipe';

@NgModule({
  declarations: [
    TooltipComponent,
    TooltipDirective,
    TypePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TooltipDirective
  ]
})
export class TooltipModule { }
