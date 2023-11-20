import { Component, Input } from "@angular/core";
import { MatListModule } from "@angular/material/list";
import { RouterModule } from "@angular/router";
import { Movie } from "src/app/model/movie.model";
import { CinemaNamePipe } from "src/app/shared/pipes/cinema-name.pipe";

@Component({
  standalone: true,
  selector: "app-movie-list",
  templateUrl: "./movie-list.component.html",
  imports: [RouterModule, CinemaNamePipe, MatListModule],
})
export class MovieListComponent {
  @Input() movies: Movie[] = [];
}
