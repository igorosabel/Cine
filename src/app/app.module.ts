import { BrowserModule }           from '@angular/platform-browser';
import { NgModule }                from '@angular/core';
import { ServiceWorkerModule }     from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule }        from '@angular/common/http';
import { FormsModule }             from '@angular/forms';
import { AppRoutingModule }        from './app-routing.module';
import { AppComponent }            from './app.component';
import { environment }             from '../environments/environment';

import { PAGES, COMPONENTS, PIPES, SERVICES } from './app.common';

@NgModule({
  declarations: [
    AppComponent,
	...PAGES,
	...COMPONENTS,
	...PIPES
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
	HttpClientModule,
	FormsModule,
    BrowserAnimationsModule
  ],
  providers: [
	...SERVICES
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
