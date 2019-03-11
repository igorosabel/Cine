export interface LoginData {
	name: string;
	pass: string;
}

export interface LoginResult {
	status: string;
	id: number;
	name: string;
	token: string;
}

export interface RegisterData {
	name: string;
	pass: string;
	conf: string;
}

export interface Movie {
	id: number;
	idCinema: number;
	name: string;
	slug: string;
	cover: string;
	coverStatus?: number;
	ticket: string;
	ticketStatus?: number;
	imdbUrl: string;
	date: string;
}

export interface MoviesResult {
	status: string;
	numPages: number;
	list: Movie[];
}

export interface MovieResult {
	status: string;
	movie: Movie;
}

export interface Cinema {
	id: number;
	name: string;
	slug: string;
}

export interface CinemasResult {
	status: string;
	list: Cinema[];
}

export interface DialogField {
	title: string;
	type: string;
	value: string;
	hint?: string;
}

export interface DialogOptions {
	title: string;
	content: string;
	fields?: DialogField[];
	ok: string;
	cancel?: string;
}

export interface StatusResult {
	status: string;
}

export interface MovieSearchResult {
  id: number;
  title: string;
  poster: string;
}

export interface MovieSearchResultList {
  status: string;
  list: MovieSearchResult[];
}

export interface MovieSearchDetailResult {
	status: string;
	title: string;
	poster: string;
	imdbUrl: string;
}