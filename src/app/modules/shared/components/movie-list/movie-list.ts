import { Component, InputSignal, input } from '@angular/core';
import {
  MatListItem,
  MatListItemAvatar,
  MatListItemLine,
  MatListItemTitle,
} from '@angular/material/list';
import { RouterLink } from '@angular/router';
import Movie from '@model/movie';
import CinemaNamePipe from '@shared/pipes/cinema-name-pipe';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.html',
  imports: [
    CinemaNamePipe,
    RouterLink,
    MatListItem,
    MatListItemAvatar,
    MatListItemTitle,
    MatListItemLine,
  ],
})
export default class MovieList {
  movies: InputSignal<Movie[]> = input.required<Movie[]>();
}
