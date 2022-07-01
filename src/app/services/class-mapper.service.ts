import { Injectable }  from '@angular/core';
import { Cinema }      from 'src/app/model/cinema.model';
import { Movie }       from 'src/app/model/movie.model';
import { MovieSearch } from 'src/app/model/movie-search.model';
import { Utils }       from 'src/app/model/utils.class';
import {
	CinemaInterface,
	MovieInterface,
	MovieSearchResult,
	MovieSearchDetailResult
} from 'src/app/interfaces/interfaces';

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

	getMovieSearches(result: MovieSearchResult[]): MovieSearch[] {
		const searches: MovieSearch[] = [];

		for (let m of result) {
			searches.push(this.getMovieSearch(m));
		}

		return searches;
	}

	getMovieSearch(m: MovieSearchResult): MovieSearch {
		return new MovieSearch(
			null,
			m.id,
			Utils.urldecode(m.title),
			Utils.urldecode(m.poster),
			null
		);
	}
	
	getMovieDetail(m: MovieSearchDetailResult): MovieSearch {
		return new MovieSearch(
			m.status,
			null,
			Utils.urldecode(m.title),
			Utils.urldecode(m.poster),
			Utils.urldecode(m.imdbUrl)
		);
	}
}
