import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { MovieResult } from "src/app/interfaces/interfaces";
import { Cinema } from "src/app/model/cinema.model";
import { Movie } from "src/app/model/movie.model";
import { MaterialModule } from "src/app/modules/material/material.module";
import { CinemaNamePipe } from "src/app/modules/shared/pipes/cinema-name.pipe";
import { ApiService } from "src/app/services/api.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { DataShareService } from "src/app/services/data-share.service";
import { DialogService } from "src/app/services/dialog.service";

@Component({
  standalone: true,
  selector: "app-movie",
  templateUrl: "./movie.component.html",
  styleUrls: ["./movie.component.scss"],
  imports: [CommonModule, MaterialModule, CinemaNamePipe],
  providers: [DialogService],
})
export class MovieComponent implements OnInit {
  from: any = [];
  cinemas: Cinema[] = [];
  selectedCinema: Cinema = null;
  movie: Movie = new Movie();
  showCover: boolean = false;

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
      this.as.getMovie(id).subscribe((result: MovieResult): void => {
        if (result.status == "ok") {
          this.movie = this.cms.getMovie(result.movie);

          this.selectedCinema =
            this.cinemas[
              this.cinemas.findIndex(
                (x: Cinema): boolean => x.id == this.movie.idCinema
              )
            ];

          const fromMovie = ["/movie", this.movie.id, this.movie.slug];
          this.from = this.dss.getGlobal("from");
          if (this.from[this.from.length - 1].join("") != fromMovie.join("")) {
            this.from.push(fromMovie);
          }
          this.dss.setGlobal("from", this.from);
        } else {
          this.dialog
            .alert({
              title: "Error",
              content: "No se ha encontrado la película indicada.",
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

  openCover(): void {
    this.showCover = !this.showCover;
  }

  selectCinema(): void {
    this.router.navigate([
      "/cinema",
      this.selectedCinema.id,
      this.selectedCinema.slug,
    ]);
  }
}
