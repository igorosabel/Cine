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
import { CinemaResult } from '@interfaces/cinema.interfaces';
import Companion from '@model/companion.model';
import Movie from '@model/movie.model';
import ApiService from '@services/api.service';
import ClassMapperService from '@services/class-mapper.service';
import NavigationService from '@services/navigation.service';
import MovieListComponent from '@shared/components/movie-list/movie-list.component';

@Component({
  selector: 'app-companion',
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
  templateUrl: './companion.component.html',
  styleUrl: './companion.component.scss',
})
export default class CompanionComponent implements OnInit {
  private ns: NavigationService = inject(NavigationService);
  private as: ApiService = inject(ApiService);
  private cms: ClassMapperService = inject(ClassMapperService);

  id: InputSignalWithTransform<number, unknown> = input.required({
    transform: numberAttribute,
  });
  companion: WritableSignal<Companion> = signal<Companion>(new Companion());
  movies: WritableSignal<Movie[]> = signal<Movie[]>([]);

  ngOnInit(): void {
    const companion: Companion | undefined = this.ns.getCompanion(this.id());
    if (companion !== undefined) {
      this.companion.set(companion);
      this.loadMovies();
    }
  }

  loadMovies(): void {
    this.as
      .getCompanionMovies(this.id())
      .subscribe((result: CinemaResult): void => {
        if (result.status === 'ok') {
          this.movies.set(this.cms.getMovies(result.list));
        }
      });
  }
}
