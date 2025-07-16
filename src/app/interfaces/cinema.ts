import { MovieInterface } from '@interfaces/movie';

export interface CinemaInterface {
  id: number | null;
  name: string | null;
  slug: string | null;
}

export interface CinemasResult {
  status: string;
  list: CinemaInterface[];
}

export interface CinemaResult {
  status: string;
  list: MovieInterface[];
}
