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
import { MoviesResult } from '@interfaces/movie';
import Movie from '@model/movie';
import ApiService from '@services/api-service';
import ClassMapperService from '@services/class-mapper-service';
import LoadingComponent from '@shared/components/loading/loading';
import MovieListComponent from '@shared/components/movie-list/movie-list';
import {
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  Observable,
  Subject,
  Subscriber,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-search-movies',
  templateUrl: './search-movies.html',
  styleUrls: ['./search-movies.scss'],
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
export default class SearchMovies implements OnInit, OnDestroy {
  private readonly apiService: ApiService = inject(ApiService);
  private readonly classMapperService: ClassMapperService =
    inject(ClassMapperService);

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
        tap((query: string): void => this.hasText.set(query.length > 0)),
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
      return new Observable<Movie[]>((observer: Subscriber<Movie[]>): void => {
        observer.next([]);
        observer.complete();
      });
    }

    this.searching.set(true);
    return this.apiService.searchTitles(query).pipe(
      map((result: MoviesResult): Movie[] => {
        this.searching.set(false);
        return this.classMapperService.getMovies(result.list);
      }),
      tap((): void => this.searching.set(false))
    );
  }
}
