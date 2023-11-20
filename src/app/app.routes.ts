import { Routes } from "@angular/router";
import { AuthGuard } from "src/app/guard/auth.guard";
import { AddMovieComponent } from "src/app/pages/add-movie/add-movie.component";
import { HomeComponent } from "src/app/pages/home/home.component";
import { LoginComponent } from "src/app/pages/login/login.component";
import { MovieComponent } from "src/app/pages/movie/movie.component";

export const routes: Routes = [
  { path: "", component: LoginComponent },
  {
    path: "register",
    loadComponent: () => import("src/app/pages/register/register.component"),
  },
  {
    path: "home",
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "movie/:id/:slug",
    component: MovieComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "add-movie",
    component: AddMovieComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "cinema/:id/:slug",
    loadComponent: () => import("src/app/pages/cinema/cinema.component"),
    canActivate: [AuthGuard],
  },
  {
    path: "cinemas",
    loadComponent: () => import("src/app/pages/cinemas/cinemas.component"),
    canActivate: [AuthGuard],
  },
  {
    path: "edit-cinema/:id/:slug",
    loadComponent: () =>
      import("src/app/pages/edit-cinema/edit-cinema.component"),
    canActivate: [AuthGuard],
  },
  {
    path: "search",
    loadComponent: () => import("src/app/pages/search/search.component"),
    canActivate: [AuthGuard],
  },
  { path: "**", redirectTo: "/", pathMatch: "full" },
];
