import { MovieSearchResult } from 'src/app/interfaces/interfaces';
import { MovieSearchDetailResult } from 'src/app/interfaces/interfaces';

export class MovieSearch {
	constructor(
		public status: string = null,
		public id: number = null,
		public title: string = null,
		public poster: string = null,
		public imdbUrl: string = null
	) {}

	toDetailInterface(): MovieSearchDetailResult {
		return {
			status: this.status,
			title: this.title,
			poster: this.poster,
			imdbUrl: this.imdbUrl
		};
	}
	
	toSearchInterface(): MovieSearchResult {
		return {
			id: this.id,
			title: this.title,
			poster: this.poster
		};
	}
}
