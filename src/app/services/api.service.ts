import { HttpClient }  from '@angular/common/http';
import { Injectable }  from '@angular/core';
import { Observable }  from 'rxjs';
import { environment } from '../../environments/environment';

import {
  LoginData,
  LoginResult,
  RegisterData,
  MoviesResult,
  CinemasResult,
  StatusResult,
  CinemaInterface,
  MovieSearchResultList,
  MovieSearchDetailResult,
  MovieInterface,
  MovieResult,
  CinemaResult
} from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
	apiUrl = environment.apiUrl;

	constructor(private http : HttpClient){}

	login(data: LoginData): Observable<LoginResult> {
		return this.http.post<LoginResult>(this.apiUrl + 'login', data);
	}

	register(data: RegisterData): Observable<LoginResult> {
		return this.http.post<LoginResult>(this.apiUrl + 'register', data);
	}

	getMovies(page: number): Observable<MoviesResult> {
		return this.http.post<MoviesResult>(this.apiUrl + 'get-movies', {page});
	}

	getCinemas(): Observable<CinemasResult> {
		return this.http.post<CinemasResult>(this.apiUrl + 'get-cinemas', {});
	}

	addCinema(name: string): Observable<StatusResult> {
		return this.http.post<StatusResult>(this.apiUrl + 'add-cinema', {name});
	}

	deleteCinema(id: number): Observable<StatusResult> {
		return this.http.post<StatusResult>(this.apiUrl + 'delete-cinema', {id});
	}

	editCinema(cinema: CinemaInterface): Observable<StatusResult> {
		return this.http.post<StatusResult>(this.apiUrl + 'edit-cinema', cinema);
	}

	searchMovie(q: string): Observable<MovieSearchResultList> {
		return this.http.post<MovieSearchResultList>(this.apiUrl + 'search-movie', {q});
	}

	selectResult(id: number): Observable<MovieSearchDetailResult> {
		return this.http.post<MovieSearchDetailResult>(this.apiUrl + 'select-result', {id});
	}

	saveMovie(movie: MovieInterface): Observable<StatusResult> {
		return this.http.post<StatusResult>(this.apiUrl + 'save-movie', movie);
	}

  getMovie(id: number): Observable<MovieResult> {
		return this.http.post<MovieResult>(this.apiUrl + 'get-movie', {id});
	}

  getCinemaMovies(id: number): Observable<CinemaResult> {
		return this.http.post<CinemaResult>(this.apiUrl + 'get-cinema-movies', {id});
	}
}
