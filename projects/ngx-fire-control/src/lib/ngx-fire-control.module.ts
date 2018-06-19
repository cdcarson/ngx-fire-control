import { NgModule } from '@angular/core';
import { NgxFireControlDirective } from './ngx-fire-control.directive';
import { NGX_FIRE_CONTROL_DEBOUNCE_DEFAULT } from './ngx-fire-control-debounce-default';
@NgModule({
  imports: [
  ],
  declarations: [
    NgxFireControlDirective
  ],
  exports: [
    NgxFireControlDirective
  ],
  providers: [
    {provide: NGX_FIRE_CONTROL_DEBOUNCE_DEFAULT, useValue: 500}
  ]
})
export class NgxFireControlModule { }
