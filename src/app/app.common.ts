/*
 * Páginas
 */
import { LoginComponent }      from 'src/app/pages/login/login.component';
import { RegisterComponent }   from 'src/app/pages/register/register.component';
import { HomeComponent }       from 'src/app/pages/home/home.component';
import { MovieComponent }      from 'src/app/pages/movie/movie.component';
import { AddMovieComponent }   from 'src/app/pages/add-movie/add-movie.component';
import { CinemaComponent }     from 'src/app/pages/cinema/cinema.component';
import { CinemasComponent }    from 'src/app/pages/cinemas/cinemas.component';
import { EditCinemaComponent } from 'src/app/pages/edit-cinema/edit-cinema.component';
import { SearchComponent }     from 'src/app/pages/search/search.component';

export const PAGES: any[] = [
	LoginComponent,
	RegisterComponent,
	HomeComponent,
	MovieComponent,
	AddMovieComponent,
	CinemaComponent,
	CinemasComponent,
	EditCinemaComponent,
	SearchComponent
];

/*
 * Componentes
 */
import { ConfirmDialogComponent } from 'src/app/components/dialogs/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent }   from 'src/app/components/dialogs/alert-dialog/alert-dialog.component';
import { FormDialogComponent }    from 'src/app/components/dialogs/form-dialog/form-dialog.component';
import { MovieListComponent }     from 'src/app/components/movie-list/movie-list.component';

export const COMPONENTS: any[] = [
	ConfirmDialogComponent,
	AlertDialogComponent,
	FormDialogComponent,
	MovieListComponent
];

/*
 * Pipes
 */
import { CinemaNamePipe } from 'src/app/pipes/cinema-name.pipe';

export const PIPES: any[] = [
	CinemaNamePipe
];

/*
 * Servicios
 */
import { ApiService }         from 'src/app/services/api.service';
import { DataShareService }   from 'src/app/services/data-share.service';
import { UserService }        from 'src/app/services/user.service';
import { AuthService }        from 'src/app/services/auth.service';
import { DialogService }      from 'src/app/services/dialog.service';
import { ClassMapperService } from 'src/app/services/class-mapper.service';

export const SERVICES: any[] = [
	ApiService,
	DataShareService,
	UserService,
	AuthService,
	DialogService,
	ClassMapperService
];

/*
 * Componentes Angular Material
 */
import { MatToolbarModule }    from '@angular/material/toolbar';
import { MatCardModule }       from '@angular/material/card';
import { MatButtonModule }     from '@angular/material/button';
import { MatFormFieldModule }  from '@angular/material/form-field';
import { MatInputModule }      from '@angular/material/input';
import { MatIconModule }       from '@angular/material/icon';
import { MatListModule }       from '@angular/material/list';
import { MatSidenavModule }    from '@angular/material/sidenav';
import { MatDialogModule }     from '@angular/material/dialog';
import { MatSelectModule }     from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

export const MATERIAL: any[] = [
	MatToolbarModule,
	MatCardModule,
	MatButtonModule,
	MatFormFieldModule,
	MatInputModule,
	MatIconModule,
	MatListModule,
	MatSidenavModule,
	MatDialogModule,
	MatSelectModule,
	MatDatepickerModule,
	MatNativeDateModule
];
