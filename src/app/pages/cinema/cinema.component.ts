import { Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatToolbarModule } from "@angular/material/toolbar";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { CinemaResult } from "src/app/interfaces/interfaces";
import { Cinema } from "src/app/model/cinema.model";
import { Movie } from "src/app/model/movie.model";
import { ApiService } from "src/app/services/api.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { DataShareService } from "src/app/services/data-share.service";
import { DialogService } from "src/app/services/dialog.service";
import { MovieListComponent } from "src/app/shared/components/movie-list/movie-list.component";

@Component({
  standalone: true,
  selector: "app-cinema",
  templateUrl: "./cinema.component.html",
  imports: [
    MovieListComponent,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
  ],
})
export default class CinemaComponent implements OnInit {
  from: any = [];
  cinemas: Cinema[] = [];
  cinema: Cinema = null;
  movies: Movie[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private dss: DataShareService,
    private router: Router,
    private dialog: DialogService,
    private as: ApiService,
    private cms: ClassMapperService
  ) {}

  ngOnInit(): void {
    this.cinemas = this.dss.getGlobal("cinemas");
    if (this.cinemas.length == 0) {
      this.router.navigate(["/home"]);
    }
    this.activatedRoute.params.subscribe((params: Params): void => {
      const id: number = params.id;
      this.cinema =
        this.cinemas[
          this.cinemas.findIndex((x: Cinema): boolean => x.id == id)
        ];

      this.as.getCinemaMovies(id).subscribe((result: CinemaResult): void => {
        if (result.status == "ok") {
          this.movies = this.cms.getMovies(result.list);

          const fromCinema = ["/cinema", this.cinema.id, this.cinema.slug];
          this.from = this.dss.getGlobal("from");
          if (this.from[this.from.length - 1].join("") != fromCinema.join("")) {
            this.from.push(fromCinema);
          }
          this.dss.setGlobal("from", this.from);
        } else {
          this.dialog
            .alert({
              title: "Error",
              content: "No se ha encontrado el cine indicado.",
              ok: "Continuar",
            })
            .subscribe((result: boolean): void => {
              this.router.navigate(["/home"]);
            });
        }
      });
    });
  }

  back(): void {
    const current = this.from.pop();
    const previous = this.from.pop();
    this.dss.setGlobal("from", this.from);
    this.router.navigate(previous);
  }
}
