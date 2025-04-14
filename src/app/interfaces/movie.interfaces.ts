import { CompanionInterface } from './companion.interfaces';

export interface MovieInterface {
  id: number | null;
  idCinema: number | null;
  name: string | null;
  slug: string | null;
  cover: string | null;
  coverStatus?: number;
  ticket: string | null;
  ticketStatus?: number;
  imdbUrl: string | null;
  date: string | null;
  companions: CompanionInterface[];
}

export interface MoviesResult {
  status: string;
  numPages: number;
  list: MovieInterface[];
}

export interface MovieResult {
  status: string;
  movie: MovieInterface;
}

export interface MovieSearchResult {
  id: number;
  title: string | null;
  poster: string | null;
}

export interface MovieSearchResultList {
  status: string;
  list: MovieSearchResult[];
}

export interface MovieSearchDetailResult {
  status: string;
  title: string | null;
  poster: string | null;
  imdbUrl: string | null;
}
