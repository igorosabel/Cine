import { Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { Router, RouterModule } from "@angular/router";
import { MoviesResult } from "src/app/interfaces/interfaces";
import { Cinema } from "src/app/model/cinema.model";
import { Movie } from "src/app/model/movie.model";
import { ApiService } from "src/app/services/api.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { DataShareService } from "src/app/services/data-share.service";
import { UserService } from "src/app/services/user.service";
import { MovieListComponent } from "src/app/shared/components/movie-list/movie-list.component";

@Component({
  standalone: true,
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  imports: [
    RouterModule,
    MovieListComponent,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class HomeComponent implements OnInit {
  page: number = 0;
  numPages: number = 0;
  movies: Movie[] = [];
  cinemas: Cinema[] = [];
  loading: boolean = true;
  loadError: boolean = false;
  opened: boolean = false;

  constructor(
    private as: ApiService,
    private dss: DataShareService,
    private user: UserService,
    private router: Router,
    private cms: ClassMapperService
  ) {}

  ngOnInit(): void {
    this.getMovies();
    this.cinemas = this.dss.getGlobal("cinemas");
    this.dss.setGlobal("from", [["/home"]]);
  }

  getMovies(ev = null): void {
    ev && ev.preventDefault();
    this.page++;
    this.as.getMovies(this.page).subscribe(
      (result: MoviesResult): void => {
        this.movies = this.movies.concat(this.cms.getMovies(result.list));
        this.numPages = result.numPages;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.loadError = true;
      }
    );
  }

  toggleSidenav(): void {
    this.opened = !this.opened;
  }

  logout(ev: MouseEvent): void {
    ev.preventDefault();
    this.user.logout();
    this.router.navigate(["/"]);
  }
}
