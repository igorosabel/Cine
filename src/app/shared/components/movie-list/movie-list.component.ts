import { Component, InputSignal, input } from "@angular/core";
import {
  MatListItem,
  MatListItemAvatar,
  MatListItemLine,
  MatListItemTitle,
} from "@angular/material/list";
import { RouterLink } from "@angular/router";
import { Movie } from "src/app/model/movie.model";
import { CinemaNamePipe } from "src/app/shared/pipes/cinema-name.pipe";

@Component({
  standalone: true,
  selector: "app-movie-list",
  templateUrl: "./movie-list.component.html",
  imports: [
    CinemaNamePipe,
    RouterLink,
    MatListItem,
    MatListItemAvatar,
    MatListItemTitle,
    MatListItemLine,
  ],
})
export class MovieListComponent {
  movies: InputSignal<Movie[]> = input.required<Movie[]>();
}
