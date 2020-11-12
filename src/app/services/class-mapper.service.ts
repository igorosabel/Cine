import { Injectable }    from '@angular/core';
import { CommonService } from './common.service';
import { Cinema }        from '../model/cinema.model';
import { Movie }         from '../model/movie.model';
import {
	CinemaInterface,
	MovieInterface
} from '../interfaces/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ClassMapperService {
	constructor(private cs: CommonService) {}

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
			c.name,
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
			this.cs.urldecode(m.name),
			m.slug,
			this.cs.urldecode(m.cover),
			this.cs.urldecode(m.ticket),
			this.cs.urldecode(m.imdbUrl),
			this.cs.urldecode(m.date)
		);
	}
}