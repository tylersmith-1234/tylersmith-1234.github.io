import { ApplicationRef, ComponentRef, Directive, ElementRef, EmbeddedViewRef, HostListener, Injector, Input, OnDestroy, ViewContainerRef } from "@angular/core";
import { TooltipComponent } from "../tooltip.component";
import { TooltipPosition } from "./tooltip.enum";

@Directive({
  selector: '[tooltip]'
})
export class TooltipDirective implements OnDestroy {
  @Input() tooltip: string | string[] = '';
  @Input() position: TooltipPosition = TooltipPosition.DEFAULT;
  private componentRef?: ComponentRef<any> = undefined;

  constructor(
    private elementRef: ElementRef,
    private appRef: ApplicationRef,
    private viewContainerRef: ViewContainerRef,
    private injector: Injector
  ) {}

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (this.componentRef === undefined) {
      const componentFactory =
            this.viewContainerRef.createComponent(
            TooltipComponent, {injector: this.injector});
      this.componentRef = componentFactory;
      const domElem = 
            (this.componentRef.hostView as EmbeddedViewRef<any>)
            .rootNodes[0] as HTMLElement;       
      document.body.appendChild(domElem);
      this.setTooltipComponentProperties();
    }
  }

private setTooltipComponentProperties() {
    if (this.componentRef !== undefined) {
      this.componentRef.instance.tooltip = this.tooltip;
      this.componentRef.instance.position = this.position;

      const {left, right, top, bottom} = this.elementRef.nativeElement.getBoundingClientRect();

      switch(this.position) {
        case TooltipPosition.BELOW: {
          this.componentRef.instance.left = Math.round((right - left) / 2 + left);
          this.componentRef.instance.top = Math.round(bottom);
          break;
        }
        case TooltipPosition.ABOVE: {
          this.componentRef.instance.left = Math.round((right - left) / 2 + left);
          this.componentRef.instance.top = Math.round(top);
          break;
        }
        case TooltipPosition.RIGHT: {
          this.componentRef.instance.left = Math.round(right);
          this.componentRef.instance.top = Math.round(top + (bottom - top) / 2);
          break;
        }
        case TooltipPosition.LEFT: {
          this.componentRef.instance.left = Math.round(left);
          this.componentRef.instance.top = Math.round(top + (bottom - top) / 2);
          break;
        }
        default: {
          break;
        }
      }
    }
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.destroy();
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  destroy(): void {
    if (this.componentRef !== undefined) {
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      this.componentRef = undefined;
    }
  }
}
