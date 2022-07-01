import { CinemaInterface } from 'src/app/interfaces/interfaces';

export class Cinema {
	constructor(
		public id: number = null,
		public name: string = null,
		public slug: string = null
	) {}
	
	toInterface(): CinemaInterface {
		return {
			id: this.id,
			name: this.name,
			slug: this.slug
		};
	}
}