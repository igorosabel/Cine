import { CommonModule } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MoviesResult } from "src/app/interfaces/interfaces";
import { Movie } from "src/app/model/movie.model";
import { MaterialModule } from "src/app/modules/material/material.module";
import { MovieListComponent } from "src/app/modules/shared/components/movie-list/movie-list.component";
import { ApiService } from "src/app/services/api.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";

@Component({
  standalone: true,
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
  imports: [CommonModule, FormsModule, MaterialModule, MovieListComponent],
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
