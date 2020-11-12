import { MovieInterface } from '../interfaces/interfaces';

export class Movie {
	coverStatus: number;
	ticketStatus: number;

	constructor(
		public id: number = null,
		public idCinema: number = null,
		public name: string = null,
		public slug: string = null,
		public cover: string = null,
		public ticket: string = null,
		public imdbUrl: string = null,
		public date: string = null
	) {
		this.coverStatus = 0;
		this.ticketStatus = 0;
	}
	
	toInterface(): MovieInterface {
		return {
			id: this.id,
			idCinema: this.idCinema,
			name: this.name,
			slug: this.slug,
			cover: this.cover,
			coverStatus: this.coverStatus,
			ticket: this.ticket,
			ticketStatus: this.ticketStatus,
			imdbUrl: this.imdbUrl,
			date: this.date
		};
	}
}