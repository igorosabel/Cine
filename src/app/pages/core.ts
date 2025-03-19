import { Provider } from '@angular/core';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldDefaultOptions,
} from '@angular/material/form-field';
import ApiService from '@services/api.service';
import AuthService from '@services/auth.service';
import ClassMapperService from '@services/class-mapper.service';
import MoviesService from '@services/movies.service';
import NavigationService from '@services/navigation.service';
import UserService from '@services/user.service';

const appearance: MatFormFieldDefaultOptions = {
  appearance: 'outline',
};

function provideCore(): Provider[] {
  return [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: appearance,
    },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    ApiService,
    AuthService,
    ClassMapperService,
    MoviesService,
    NavigationService,
    UserService,
  ];
}
export default provideCore;
