import { Injectable }  from '@angular/core';
import { Cinema }      from '../model/cinema.model';
import { Movie }       from '../model/movie.model';
import { MovieSearch } from '../model/movie-search.model';
import { Utils }       from '../model/utils.class';
import {
	CinemaInterface,
	MovieInterface,
	MovieSearchDetailResult
} from '../interfaces/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ClassMapperService {
	constructor() {}

	getCinemas(result: CinemaInterface[]): Cinema[] {
		const cinemas: Cinema[] = [];

		for (let c of result) {
			cinemas.push(this.getCinema(c));
		}

		return cinemas;
	}

	getCinema(c: CinemaInterface): Cinema {
		return new Cinema(
			c.id,
			Utils.urldecode(c.name),
			c.slug
		);
	}

	getMovies(result: MovieInterface[]): Movie[] {
		const movies: Movie[] = [];

		for (let m of result) {
			movies.push(this.getMovie(m));
		}

		return movies;
	}

	getMovie(m: MovieInterface): Movie {
		return new Movie(
			m.id,
			m.idCinema,
			Utils.urldecode(m.name),
			m.slug,
			Utils.urldecode(m.cover),
			Utils.urldecode(m.ticket),
			Utils.urldecode(m.imdbUrl),
			Utils.urldecode(m.date)
		);
	}

	getMovieSearches(result: MovieSearchDetailResult[]): MovieSearch[] {
		const searches: MovieSearch[] = [];

		for (let m of result) {
			searches.push(this.getMovieSearch(m));
		}

		return searches;
	}

	getMovieSearch(m: MovieSearchDetailResult): MovieSearch {
		return new MovieSearch(
			m.status,
			Utils.urldecode(m.title),
			Utils.urldecode(m.poster),
			Utils.urldecode(m.imdbUrl)
		);
	}
}
