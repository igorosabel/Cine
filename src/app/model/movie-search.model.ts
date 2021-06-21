import { MovieSearchDetailResult } from '../interfaces/interfaces';

export class MovieSearch {
	constructor(
		public status: string = null,
		public title: string = null,
		public poster: string = null,
		public imdbUrl: string = null
	) {}

	toInterface(): MovieSearchDetailResult {
		return {
			status: this.status,
			title: this.title,
			poster: this.poster,
			imdbUrl: this.imdbUrl
		};
	}
}
