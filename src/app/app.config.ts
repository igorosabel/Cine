import { ApplicationConfig } from '@angular/core';
import {
  InMemoryScrollingFeature,
  InMemoryScrollingOptions,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import routes from '@app/app.routes';
import TokenInterceptor from '@app/interceptors/token.interceptor';
import provideCore from '@pages/core';

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
};
const inMemoryScrollingFeature: InMemoryScrollingFeature =
  withInMemoryScrolling(scrollConfig);

const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withViewTransitions(),
      inMemoryScrollingFeature,
      withComponentInputBinding()
    ),
    provideHttpClient(withInterceptors([TokenInterceptor])),
    provideAnimationsAsync(),
    provideCore(),
  ],
};

export default appConfig;
