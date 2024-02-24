import { NgClass, NgOptimizedImage } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatIconButton } from "@angular/material/button";
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import {
  MatList,
  MatListItem,
  MatListItemLine,
  MatListItemMeta,
  MatNavList,
} from "@angular/material/list";
import { MatToolbar, MatToolbarRow } from "@angular/material/toolbar";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { MovieResult } from "src/app/interfaces/interfaces";
import { Cinema } from "src/app/model/cinema.model";
import { Movie } from "src/app/model/movie.model";
import { ApiService } from "src/app/services/api.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { DataShareService } from "src/app/services/data-share.service";
import { DialogService } from "src/app/services/dialog.service";
import { CinemaNamePipe } from "src/app/shared/pipes/cinema-name.pipe";

@Component({
  standalone: true,
  selector: "app-movie",
  templateUrl: "./movie.component.html",
  styleUrls: ["./movie.component.scss"],
  imports: [
    NgClass,
    CinemaNamePipe,
    MatToolbar,
    MatToolbarRow,
    MatIconButton,
    MatIcon,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatList,
    MatNavList,
    MatListItem,
    MatListItemLine,
    MatListItemMeta,
    NgOptimizedImage,
  ],
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
