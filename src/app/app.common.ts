/*
 * Páginas
 */
import { LoginComponent }      from './pages/login/login.component';
import { RegisterComponent }   from './pages/register/register.component';
import { HomeComponent }       from './pages/home/home.component';
import { MovieComponent }      from './pages/movie/movie.component';
import { AddMovieComponent }   from './pages/add-movie/add-movie.component';
import { CinemaComponent }     from './pages/cinema/cinema.component';
import { CinemasComponent }    from './pages/cinemas/cinemas.component';
import { EditCinemaComponent } from './pages/edit-cinema/edit-cinema.component';
import { SearchComponent }     from './pages/search/search.component';

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
import { ConfirmDialogComponent } from './components/dialogs/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent }   from './components/dialogs/alert-dialog/alert-dialog.component';
import { FormDialogComponent }    from './components/dialogs/form-dialog/form-dialog.component';
import { MovieListComponent }     from './components/movie-list/movie-list.component';

export const COMPONENTS: any[] = [
	ConfirmDialogComponent,
	AlertDialogComponent,
	FormDialogComponent,
	MovieListComponent
];

/*
 * Pipes
 */
import { CinemaNamePipe } from './pipes/cinema-name.pipe';

export const PIPES: any[] = [
	CinemaNamePipe
];

/*
 * Servicios
 */
import { ApiService }         from './services/api.service';
import { DataShareService }   from './services/data-share.service';
import { UserService }        from './services/user.service';
import { AuthService }        from './services/auth.service';
import { DialogService }      from './services/dialog.service';
import { ClassMapperService } from './services/class-mapper.service';

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
