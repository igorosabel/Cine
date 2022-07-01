import { BrowserModule }                       from '@angular/platform-browser';
import { NgModule }                            from '@angular/core';
import { BrowserAnimationsModule }             from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule }                         from '@angular/forms';
import { AppRoutingModule }                    from 'src/app/app-routing.module';
import { AppComponent }                        from 'src/app/app.component';
import { TokenInterceptor }                    from 'src/app/interceptors/token.interceptor';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { PAGES, COMPONENTS, PIPES, SERVICES, MATERIAL } from 'src/app/app.common';

const appearance: MatFormFieldDefaultOptions = {
	appearance: 'outline'
};

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
		HttpClientModule,
		FormsModule,
		BrowserAnimationsModule,
		...MATERIAL
	],
	providers: [
		{
			provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
			useValue: appearance
		},
		...SERVICES,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: TokenInterceptor,
			multi: true
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
