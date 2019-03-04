import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent }      from './pages/login/login.component';
import { RegisterComponent }   from './pages/register/register.component';
import { HomeComponent }       from './pages/home/home.component';
import { MovieComponent }      from './pages/movie/movie.component';
import { AddMovieComponent }   from './pages/add-movie/add-movie.component';
import { CinemaComponent }     from './pages/cinema/cinema.component';
import { CinemasComponent }    from './pages/cinemas/cinemas.component';
import { EditCinemaComponent } from './pages/edit-cinema/edit-cinema.component';
import { AuthGuard }           from './guard/auth.guard';

const routes: Routes = [
	{ path: '',                      component: LoginComponent },
	{ path: 'register',              component: RegisterComponent },
	{ path: 'home',                  component: HomeComponent,       canActivate: [AuthGuard] },
	{ path: 'movie/:id/:slug',       component: MovieComponent,      canActivate: [AuthGuard] },
	{ path: 'add-movie',             component: AddMovieComponent,   canActivate: [AuthGuard] },
	{ path: 'cinema/:id/:slug',      component: CinemaComponent,     canActivate: [AuthGuard] },
	{ path: 'cinemas',               component: CinemasComponent,    canActivate: [AuthGuard] },
	{ path: 'edit-cinema/:id/:slug', component: EditCinemaComponent, canActivate: [AuthGuard] },
	{ path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
