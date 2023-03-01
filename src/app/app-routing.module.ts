import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "src/app/guard/auth.guard";
import { AddMovieComponent } from "src/app/modules/add-movie/add-movie.component";
import { HomeComponent } from "src/app/modules/home/home.component";
import { LoginComponent } from "src/app/modules/login/login.component";
import { MovieComponent } from "src/app/modules/movie/movie.component";

const routes: Routes = [
  { path: "", component: LoginComponent },
  {
    path: "register",
    loadComponent: () => import("src/app/modules/register/register.component"),
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
    loadComponent: () => import("src/app/modules/cinema/cinema.component"),
    canActivate: [AuthGuard],
  },
  {
    path: "cinemas",
    loadComponent: () => import("src/app/modules/cinemas/cinemas.component"),
    canActivate: [AuthGuard],
  },
  {
    path: "edit-cinema/:id/:slug",
    loadComponent: () =>
      import("src/app/modules/edit-cinema/edit-cinema.component"),
    canActivate: [AuthGuard],
  },
  {
    path: "search",
    loadComponent: () => import("src/app/modules/search/search.component"),
    canActivate: [AuthGuard],
  },
  { path: "**", redirectTo: "/", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
