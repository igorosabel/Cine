import { Injectable }  from '@angular/core';
import { Cinema }      from 'src/app/model/cinema.model';
import { Movie }       from 'src/app/model/movie.model';
import { MovieSearch } from 'src/app/model/movie-search.model';
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
		return new Cinema().fromInterface(c);
	}

	getMovies(result: MovieInterface[]): Movie[] {
		const movies: Movie[] = [];

		for (let m of result) {
			movies.push(this.getMovie(m));
		}

		return movies;
	}

	getMovie(m: MovieInterface): Movie {
		return new Movie().fromInterface(m);
	}

	getMovieSearches(result: MovieSearchResult[]): MovieSearch[] {
		const searches: MovieSearch[] = [];

		for (let m of result) {
			searches.push(this.getMovieSearch(m));
		}

		return searches;
	}

	getMovieSearch(msr: MovieSearchResult): MovieSearch {
		return new MovieSearch().fromInterface(null, msr, null);
	}
	
	getMovieDetail(msd: MovieSearchDetailResult): MovieSearch {
		return new MovieSearch().fromInterface(msd.status, {id: null, title: msd.title, poster: msd.poster}, msd.imdbUrl);
	}
}
