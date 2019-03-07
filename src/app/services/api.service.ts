import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable }              from '@angular/core';
import { Observable }              from 'rxjs';
import { environment }             from '../../environments/environment';

import {
  LoginData,
  LoginResult,
  RegisterData,
  MoviesResult,
  CinemasResult,
  StatusResult
} from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
	apiUrl = environment.apiUrl;

	constructor(private http : HttpClient){}

	login(data: LoginData): Observable<LoginResult> {
		return this.http.post<LoginResult>(this.apiURL+'login', data);
	}

	register(data: RegisterData): Observable<LoginResult> {
		return this.http.post<LoginResult>(this.apiURL+'register', data);
	}
	
	getMovies(page: number): Observable<MoviesResult> {
		return this.http.post<MoviesResult>(this.apiURL+'get-movies', {page});
	}
	
	getCinemas(): Observable<CinemasResult> {
		return this.http.post<CinemasResult>(this.apiURL+'get-cinemas', {});
	}
	
	addCinema(name: string): Observable<StatusResult> {
		return this.http.post<StatusResult>(this.apiURL+'add-cinema', {name});
	}
	
	deleteCinema(id: number): Observable<StatusResult> {
		return this.http.post<StatusResult>(this.apiURL+'delete-cinema', {name});
	}
}