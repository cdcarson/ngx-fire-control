import { InjectionToken } from '@angular/core';
export const NGX_FIRE_CONTROL_DEBOUNCE_DEFAULT = new InjectionToken<number>(
  'The default time in milliseconds that the directive waits before saving a text control\'s value to firebase.'
);
