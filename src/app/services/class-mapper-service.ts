import { Injectable } from '@angular/core';
import { CinemaInterface } from '@interfaces/cinema';
import { CompanionInterface } from '@interfaces/companion';
import {
  MovieInterface,
  MovieSearchDetailResult,
  MovieSearchResult,
} from '@interfaces/movie';
import Cinema from '@model/cinema';
import Companion from '@model/companion';
import Movie from '@model/movie';
import MovieSearch from '@model/movie-search';

@Injectable({
  providedIn: 'root',
})
export default class ClassMapperService {
  getCinemas(cs: CinemaInterface[]): Cinema[] {
    return cs.map((c: CinemaInterface): Cinema => {
      return this.getCinema(c);
    });
  }

  getCinema(c: CinemaInterface): Cinema {
    return new Cinema().fromInterface(c);
  }

  getMovies(ms: MovieInterface[]): Movie[] {
    return ms.map((m: MovieInterface): Movie => {
      return this.getMovie(m);
    });
  }

  getMovie(m: MovieInterface): Movie {
    return new Movie().fromInterface(m);
  }

  getMovieSearches(mss: MovieSearchResult[]): MovieSearch[] {
    return mss.map((ms: MovieSearchResult): MovieSearch => {
      return this.getMovieSearch(ms);
    });
  }

  getMovieSearch(msr: MovieSearchResult): MovieSearch {
    return new MovieSearch().fromInterface('ok', msr, '');
  }

  getMovieDetail(msd: MovieSearchDetailResult): MovieSearch {
    return new MovieSearch().fromInterface(
      msd.status,
      { id: -1, title: msd.title, poster: msd.poster },
      msd.imdbUrl !== null ? msd.imdbUrl : ''
    );
  }

  getCompanion(c: CompanionInterface): Companion {
    return new Companion().fromInterface(c);
  }

  getCompanions(cs: CompanionInterface[]): Companion[] {
    return cs.map((c: CompanionInterface): Companion => {
      return this.getCompanion(c);
    });
  }
}
