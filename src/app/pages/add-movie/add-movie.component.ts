import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatSelectModule } from "@angular/material/select";
import { MatToolbarModule } from "@angular/material/toolbar";
import { Router, RouterModule } from "@angular/router";
import {
  MovieSearchDetailResult,
  MovieSearchResult,
  MovieSearchResultList,
  StatusResult,
} from "src/app/interfaces/interfaces";
import { Cinema } from "src/app/model/cinema.model";
import { MovieSearch } from "src/app/model/movie-search.model";
import { Movie } from "src/app/model/movie.model";
import { ApiService } from "src/app/services/api.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { DataShareService } from "src/app/services/data-share.service";
import { DialogService } from "src/app/services/dialog.service";

@Component({
  standalone: true,
  selector: "app-add-movie",
  templateUrl: "./add-movie.component.html",
  styleUrls: ["./add-movie.component.scss"],
  imports: [
    FormsModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatListModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
  ],
})
export class AddMovieComponent implements OnInit {
  cinemas: Cinema[] = [];
  movie: Movie = new Movie();
  uploadingCover: boolean = false;
  uploadingTicket: boolean = false;
  searchTimer: number = null;
  searching: boolean = false;
  searchResults: MovieSearch[] = [];
  sending: boolean = false;

  constructor(
    private dss: DataShareService,
    private router: Router,
    private dialog: DialogService,
    private as: ApiService,
    private cms: ClassMapperService
  ) {}

  ngOnInit(): void {
    this.cinemas = this.dss.getGlobal("cinemas");
    this.movie = new Movie(
      null,
      null,
      "",
      "",
      "https://apicine.osumi.es/cover/def.webp",
      "https://apicine.osumi.es/cover/def.webp",
      "",
      ""
    );
    if (this.cinemas.length == 0) {
      this.dialog
        .alert({
          title: "Error",
          content: "Antes de añadir una película tienes que añadir el cine.",
          ok: "Continuar",
        })
        .subscribe((result: boolean): void => {
          this.router.navigate(["/home"]);
        });
    }
  }

  uploadCover(): void {
    document.getElementById("cover").click();
  }

  onCoverChange(event: Event): void {
    let reader: FileReader = new FileReader();
    if (
      (<HTMLInputElement>event.target).files &&
      (<HTMLInputElement>event.target).files.length > 0
    ) {
      let file = (<HTMLInputElement>event.target).files[0];
      reader.readAsDataURL(file);
      reader.onload = (): void => {
        this.movie.cover = reader.result as string;
        this.movie.coverStatus = 1;
        (<HTMLInputElement>document.getElementById("cover")).value = "";
      };
    }
  }

  uploadTicket(): void {
    document.getElementById("ticket").click();
  }

  onTicketChange(event: Event): void {
    let reader: FileReader = new FileReader();
    if (
      (<HTMLInputElement>event.target).files &&
      (<HTMLInputElement>event.target).files.length > 0
    ) {
      let file = (<HTMLInputElement>event.target).files[0];
      reader.readAsDataURL(file);
      reader.onload = (): void => {
        this.movie.ticket = reader.result as string;
        this.movie.ticketStatus = 1;
        (<HTMLInputElement>document.getElementById("ticket")).value = "";
      };
    }
  }

  searchMovieStart(): void {
    clearTimeout(this.searchTimer);
    this.searchTimer = window.setTimeout((): void => {
      this.searchMovie();
    }, 500);
  }

  searchMovieStop(): void {
    clearTimeout(this.searchTimer);
  }

  searchMovie(): void {
    if (this.movie.name.length >= 3) {
      this.searchMovieStop();
      this.searching = true;
      this.as
        .searchMovie(this.movie.name)
        .subscribe((result: MovieSearchResultList): void => {
          this.searching = false;
          this.searchResults = this.cms.getMovieSearches(result.list);
        });
    }
  }

  closeSearchResults(): void {
    this.searchResults = [];
  }

  selectResult(movieResult: MovieSearchResult): void {
    this.as
      .selectResult(movieResult.id)
      .subscribe((result: MovieSearchDetailResult): void => {
        let searchResult: MovieSearch = this.cms.getMovieDetail(result);
        this.movie.name = searchResult.title;
        this.movie.cover = searchResult.poster;
        this.movie.coverStatus = 2;
        this.movie.imdbUrl = searchResult.imdbUrl;

        this.closeSearchResults();
      });
  }

  saveMovie(): void {
    if (this.movie.name == "") {
      this.dialog.alert({
        title: "Error",
        content: "¡No has introducido el nombre de la película!",
        ok: "Continuar",
      });
      return;
    }
    if (this.movie.idCinema === null) {
      this.dialog.alert({
        title: "Error",
        content: "¡No has elegido cine!",
        ok: "Continuar",
      });
      return;
    }
    if (this.movie.coverStatus === 0) {
      this.dialog.alert({
        title: "Error",
        content: "¡No has elegido ninguna carátula!",
        ok: "Continuar",
      });
      return;
    }
    if (this.movie.imdbUrl === "") {
      this.dialog.alert({
        title: "Error",
        content: "¡No has introducido la URL de IMDB!",
        ok: "Continuar",
      });
      return;
    }
    if (this.movie.date === "") {
      this.dialog.alert({
        title: "Error",
        content: "¡No has elegido fecha para la película!",
        ok: "Continuar",
      });
      return;
    }
    if (this.movie.ticketStatus === 0) {
      this.dialog.alert({
        title: "Error",
        content: "¡No has elegido ninguna entrada!",
        ok: "Continuar",
      });
      return;
    }

    this.sending = true;
    this.as
      .saveMovie(this.movie.toInterface())
      .subscribe((result: StatusResult): void => {
        if (result.status == "ok") {
          this.dialog
            .alert({
              title: "¡Hecho!",
              content: "Nueva película guardada.",
              ok: "Continuar",
            })
            .subscribe((result: boolean) => {
              this.router.navigate(["/home"]);
            });
        } else {
          this.sending = false;
          this.dialog.alert({
            title: "Error",
            content: "Ocurrió un error al guardar la película.",
            ok: "Continuar",
          });
        }
      });
  }
}
