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
	cover: string;
	ticket: string;
	imdbUrl: string;
	date: string;
}

export interface MoviesResult {
	status: string;
	list: Movie[];
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