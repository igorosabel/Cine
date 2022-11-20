import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent }      from 'src/app/pages/login/login.component';
import { RegisterComponent }   from 'src/app/pages/register/register.component';
import { HomeComponent }       from 'src/app/pages/home/home.component';
import { MovieComponent }      from 'src/app/pages/movie/movie.component';
import { AddMovieComponent }   from 'src/app/pages/add-movie/add-movie.component';
import { CinemaComponent }     from 'src/app/pages/cinema/cinema.component';
import { CinemasComponent }    from 'src/app/pages/cinemas/cinemas.component';
import { EditCinemaComponent } from 'src/app/pages/edit-cinema/edit-cinema.component';
import { SearchComponent }     from 'src/app/pages/search/search.component';
import { AuthGuard }           from 'src/app/guard/auth.guard';

const routes: Routes = [
	{ path: '',                      component: LoginComponent },
	{ path: 'register',              component: RegisterComponent },
	{ path: 'home',                  component: HomeComponent,       canActivate: [AuthGuard] },
	{ path: 'movie/:id/:slug',       component: MovieComponent,      canActivate: [AuthGuard] },
	{ path: 'add-movie',             component: AddMovieComponent,   canActivate: [AuthGuard] },
	{ path: 'cinema/:id/:slug',      component: CinemaComponent,     canActivate: [AuthGuard] },
	{ path: 'cinemas',               component: CinemasComponent,    canActivate: [AuthGuard] },
	{ path: 'edit-cinema/:id/:slug', component: EditCinemaComponent, canActivate: [AuthGuard] },
	{ path: 'search',                component: SearchComponent,     canActivate: [AuthGuard] },
	{ path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
