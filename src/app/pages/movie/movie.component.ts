import { NgOptimizedImage } from '@angular/common';
import {
  Component,
  InputSignal,
  OnInit,
  Signal,
  WritableSignal,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import {
  MatList,
  MatListItem,
  MatListItemLine,
  MatListItemMeta,
  MatListItemTitle,
  MatNavList,
} from '@angular/material/list';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import MoviesService from '@app/services/movies.service';
import { NavigationFromType } from '@interfaces/interfaces';
import Cinema from '@model/cinema.model';
import Movie from '@model/movie.model';
import NavigationService from '@services/navigation.service';
import CinemaNamePipe from '@shared/pipes/cinema-name.pipe';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss'],
  imports: [
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
    MatListItemTitle,
    MatListItemLine,
    MatListItemMeta,
    NgOptimizedImage,
  ],
})
export default class MovieComponent implements OnInit {
  private router: Router = inject(Router);
  private ms: MoviesService = inject(MoviesService);
  private ns: NavigationService = inject(NavigationService);

  id: InputSignal<number> = input.required<number>();
  numericId: Signal<number> = computed((): number => Number(this.id()));
  cinemas: WritableSignal<Cinema[]> = signal<Cinema[]>([]);
  selectedCinema: WritableSignal<Cinema | null> = signal<Cinema>(new Cinema());
  movie: WritableSignal<Movie> = signal<Movie>(new Movie());
  showCover: WritableSignal<boolean> = signal<boolean>(false);
  movieCover: string = '';

  ngOnInit(): void {
    this.cinemas.set(this.ns.getCinemas());
    if (this.cinemas().length == 0) {
      this.router.navigate(['/home']);
    }
    this.ms.getMovieById(this.numericId()).subscribe((movie: Movie): void => {
      if (movie) {
        const idCinema: number | null = movie.idCinema;
        if (idCinema !== null) {
          this.selectedCinema.set(this.ns.getCinema(idCinema));
        }
        if (movie.cover !== null) {
          this.movieCover = movie.cover;
        }

        const fromMovie: NavigationFromType = ['/movie', movie.id, movie.slug];
        const lastItem: NavigationFromType = this.ns.getLast();
        if (lastItem.join('') != fromMovie.join('')) {
          this.ns.add(fromMovie);
        }
        this.movie.set(movie);
      }
    });
  }

  back(): void {
    const current: NavigationFromType = this.ns.get();
    const previous: NavigationFromType = this.ns.get();
    if (previous.length === 0) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(previous);
    }
  }

  openCover(): void {
    this.showCover.update((value: boolean): boolean => !value);
  }

  selectCinema(): void {
    this.router.navigate([
      '/cinema',
      this.selectedCinema()?.id,
      this.selectedCinema()?.slug,
    ]);
  }
}
