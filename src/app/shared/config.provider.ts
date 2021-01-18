import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { LOCALE_ID } from '@angular/core';

export const CONFIG_PROVIDER = [
  { provide: MAT_DATE_LOCALE, useValue: 'es-AR' },
  { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  { provide: LOCALE_ID, useValue: 'es-AR' }
];
