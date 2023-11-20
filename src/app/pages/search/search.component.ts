import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterModule } from "@angular/router";
import { MoviesResult } from "src/app/interfaces/interfaces";
import { Movie } from "src/app/model/movie.model";
import { ApiService } from "src/app/services/api.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { MovieListComponent } from "src/app/shared/components/movie-list/movie-list.component";

@Component({
  standalone: true,
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
  imports: [
    FormsModule,
    RouterModule,
    MovieListComponent,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
  ],
})
export default class SearchComponent implements OnInit {
  @ViewChild("searchBox", { static: true }) searchBox: ElementRef;
  q: string = null;
  movies: Movie[] = [];
  searchTimer: number = null;
  searching: boolean = false;

  constructor(private as: ApiService, private cms: ClassMapperService) {}
  ngOnInit(): void {
    this.searchBox.nativeElement.focus();
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
    if (this.q.length >= 3) {
      this.searchMovieStop();
      this.searching = true;
      this.as.searchTitles(this.q).subscribe((result: MoviesResult): void => {
        this.searching = false;
        this.movies = this.cms.getMovies(result.list);
      });
    } else {
      this.movies = [];
    }
  }
}
