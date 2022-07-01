import { CinemaInterface } from 'src/app/interfaces/interfaces';
import { Utils }           from 'src/app/model/utils.class';

export class Cinema {
	constructor(
		public id: number = null,
		public name: string = null,
		public slug: string = null
	) {}

	fromInterface(c: CinemaInterface): Cinema {
		this.id = c.id;
		this.name = Utils.urldecode(c.name);
		this.slug = c.slug;

		return this;
	}

	toInterface(): CinemaInterface {
		return {
			id: this.id,
			name: Utils.urlencode(this.name),
			slug: this.slug
		};
	}
}