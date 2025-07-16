import {
  Component,
  inject,
  input,
  InputSignalWithTransform,
  numberAttribute,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatListItem, MatNavList } from '@angular/material/list';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { CinemaResult } from '@interfaces/cinema';
import { ApiStatus } from '@interfaces/contants';
import Companion from '@model/companion';
import Movie from '@model/movie';
import ApiService from '@services/api-service';
import ClassMapperService from '@services/class-mapper-service';
import NavigationService from '@services/navigation-service';
import MovieListComponent from '@shared/components/movie-list/movie-list';

@Component({
  selector: 'app-companion-movies',
  imports: [
    MatToolbar,
    MatToolbarRow,
    MatIconButton,
    MatIcon,
    MatNavList,
    MatListItem,
    MovieListComponent,
    RouterLink,
  ],
  templateUrl: './companion-movies.html',
  styleUrl: './companion-movies.scss',
})
export default class CompanionMovies implements OnInit {
  private readonly apiService: ApiService = inject(ApiService);
  private readonly classMapperService: ClassMapperService =
    inject(ClassMapperService);
  private readonly navigationService: NavigationService =
    inject(NavigationService);

  id: InputSignalWithTransform<number, unknown> = input.required({
    transform: numberAttribute,
  });
  companion: WritableSignal<Companion> = signal<Companion>(new Companion());
  movies: WritableSignal<Movie[]> = signal<Movie[]>([]);

  ngOnInit(): void {
    const companion: Companion | undefined =
      this.navigationService.getCompanion(this.id());
    if (companion !== undefined) {
      this.companion.set(companion);
      this.loadMovies();
    }
  }

  loadMovies(): void {
    this.apiService.getCompanionMovies(this.id()).subscribe({
      next: (result: CinemaResult): void => {
        if (result.status === ApiStatus.OK) {
          this.movies.set(this.classMapperService.getMovies(result.list));
        }
      },
      error: (err: Error): void => {
        console.error('Error loading companion movies:', err);
        this.movies.set([]);
      },
    });
  }
}
