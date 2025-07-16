import { Routes } from '@angular/router';
import AuthGuard from '@guard/auth-guard';
import Login from '@modules/user/login/login';

const routes: Routes = [
  { path: '', component: Login },
  {
    path: 'register',
    loadComponent: () => import('@modules/user/register/register'),
  },
  {
    path: 'home',
    loadComponent: () => import('@modules/home/home'),
    canActivate: [AuthGuard],
  },
  {
    path: 'movie/:id/:slug',
    loadComponent: () => import('@modules/movies/movie-detail/movie-detail'),
    canActivate: [AuthGuard],
  },
  {
    path: 'add-movie',
    loadComponent: () => import('@modules/movies/add-movie/add-movie'),
    canActivate: [AuthGuard],
  },
  {
    path: 'cinema/:id/:slug',
    loadComponent: () => import('@modules/cinemas/cinema-movies/cinema-movies'),
    canActivate: [AuthGuard],
  },
  {
    path: 'cinemas',
    loadComponent: () => import('@modules/cinemas/cinema-list/cinema-list'),
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-cinema/:id/:slug',
    loadComponent: () => import('@modules/cinemas/edit-cinema/edit-cinema'),
    canActivate: [AuthGuard],
  },
  {
    path: 'search',
    loadComponent: () => import('@modules/movies/search-movies/search-movies'),
    canActivate: [AuthGuard],
  },
  {
    path: 'companions',
    loadComponent: () =>
      import('@modules/companions/companion-list/companion-list'),
    canActivate: [AuthGuard],
  },
  {
    path: 'companion/:id',
    loadComponent: () =>
      import('@modules/companions/companion-movies/companion-movies'),
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

export default routes;
