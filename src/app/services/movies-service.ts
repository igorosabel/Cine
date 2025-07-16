import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { MovieResult, MoviesResult } from '@interfaces/movie';
import Movie from '@model/movie';
import ApiService from '@services/api-service';
import ClassMapperService from '@services/class-mapper-service';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export default class MoviesService {
  private apiService: ApiService = inject(ApiService);
  private classMapperService: ClassMapperService = inject(ClassMapperService);

  cachedMovies: WritableSignal<Movie[]> = signal<Movie[]>([]);
  currentPage: WritableSignal<number> = signal<number>(0);
  numPages: WritableSignal<number> = signal<number>(1);

  getMovies(): Observable<Movie[]> {
    if (this.currentPage() >= this.numPages()) {
      return of(this.cachedMovies());
    }

    this.currentPage.update((page: number): number => page + 1);

    return this.apiService.getMovies(this.currentPage()).pipe(
      tap((result: MoviesResult): void => {
        this.cachedMovies.update((movies: Movie[]): Movie[] => [
          ...movies,
          ...this.classMapperService.getMovies(result.list),
        ]);
        this.numPages.set(result.numPages);
      }),
      map((): Movie[] => this.cachedMovies()),
      catchError((error) => {
        console.error('Error al obtener películas:', error);
        return throwError((): Error => new Error('Error al cargar películas'));
      })
    );
  }

  getMovieById(id: number): Observable<Movie> {
    const foundMovie: Movie | undefined = this.cachedMovies().find(
      (movie: Movie): boolean => movie.id === id
    );
    if (foundMovie) {
      return of(foundMovie);
    }

    return this.apiService.getMovie(id).pipe(
      map(
        (result: MovieResult): Movie =>
          this.classMapperService.getMovie(result.movie)
      ),
      catchError((error) => {
        console.error(`Error al obtener la película con ID ${id}:`, error);
        return throwError((): Error => new Error('Error al cargar película'));
      })
    );
  }

  clearCache(): void {
    this.cachedMovies.set([]);
    this.currentPage.set(0);
    this.numPages.set(1);
  }
}
