import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  Signal,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatNavList } from '@angular/material/list';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import LoadingComponent from '@app/shared/components/loading/loading.component';
import { MoviesResult } from '@interfaces/interfaces';
import Movie from '@model/movie.model';
import ApiService from '@services/api.service';
import ClassMapperService from '@services/class-mapper.service';
import MovieListComponent from '@shared/components/movie-list/movie-list.component';
import {
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  Observable,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  imports: [
    RouterLink,
    MatToolbar,
    MatToolbarRow,
    MatIconButton,
    MatIcon,
    MatFormField,
    MatLabel,
    MatInput,
    MatNavList,
    MovieListComponent,
    LoadingComponent,
  ],
})
export default class SearchComponent implements OnInit, OnDestroy {
  private as: ApiService = inject(ApiService);
  private cms: ClassMapperService = inject(ClassMapperService);

  movies: WritableSignal<Movie[]> = signal<Movie[]>([]);
  searchBox: Signal<ElementRef> = viewChild.required('searchBox');
  destroy$: Subject<void> = new Subject<void>();
  hasText: WritableSignal<boolean> = signal<boolean>(false);
  searching: WritableSignal<boolean> = signal<boolean>(false);

  ngOnInit(): void {
    this.searchBox().nativeElement.focus();

    fromEvent(this.searchBox().nativeElement, 'keyup')
      .pipe(
        debounceTime(500),
        map(() => this.searchBox().nativeElement.value.trim()),
        distinctUntilChanged(),
        tap((query: string) => this.hasText.set(query.length > 0)),
        switchMap(
          (query: string): Observable<Movie[]> => this.searchMovie(query)
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((movies: Movie[]): void => this.movies.set(movies));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  clearSearch(): void {
    this.searchBox().nativeElement.value = '';
    this.movies.set([]);
    this.hasText.set(false);
  }

  searchMovie(query: string): Observable<Movie[]> {
    if (query.length < 3) {
      this.movies.set([]);
      return new Observable<Movie[]>((observer) => {
        observer.next([]);
        observer.complete();
      });
    }

    this.searching.set(true);
    return this.as.searchTitles(query).pipe(
      map((result: MoviesResult): Movie[] => {
        this.searching.set(false);
        return this.cms.getMovies(result.list);
      }),
      tap(() => this.searching.set(false))
    );
  }
}
