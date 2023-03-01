import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Movie } from "src/app/model/movie.model";
import { MaterialModule } from "src/app/modules/material/material.module";
import { CinemaNamePipe } from "src/app/modules/shared/pipes/cinema-name.pipe";

@Component({
  standalone: true,
  selector: "app-movie-list",
  templateUrl: "./movie-list.component.html",
  imports: [CommonModule, RouterModule, MaterialModule, CinemaNamePipe],
})
export class MovieListComponent {
  @Input() movies: Movie[] = [];
}
